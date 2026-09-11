-- ZedPrep initial schema
-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/jkfzanjcganzhhmmwcxh/sql
-- This migration creates the core tables, RLS policies, and helper functions needed for Step 2.

-- =====================================================================
-- Extensions
-- =====================================================================
create extension if not exists "pgcrypto";

-- =====================================================================
-- Updated-at trigger function (reused by all tables)
-- =====================================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =====================================================================
-- Schools
-- =====================================================================
create table if not exists public.schools (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text unique not null,
  location      text,
  district      text,
  contact_name  text,
  contact_phone text,
  contact_email text,
  plan          text not null default 'trial',
  status        text not null default 'active',
  joined_at     timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger schools_updated_at
  before update on public.schools
  for each row execute function public.handle_updated_at();

create index if not exists schools_status_idx on public.schools (status);

-- =====================================================================
-- Users (profile layer on top of auth.users)
-- One row per authenticated user. role determines what they can do.
-- =====================================================================
create table if not exists public.users (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text not null,
  phone           text,
  role            text not null check (role in ('student','teacher','parent','school_admin','platform_admin')),
  school_id       uuid references public.schools(id) on delete set null,
  grade           text,
  is_active       boolean not null default true,
  last_active_at  timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger users_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();

create index if not exists users_school_idx on public.users (school_id);
create index if not exists users_role_idx on public.users (role);

-- =====================================================================
-- Subjects
-- =====================================================================
create table if not exists public.subjects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  code        text unique not null,
  syllabus    text not null default 'ECZ',
  color_hex   text,
  created_at  timestamptz not null default now()
);

-- Seed the four MVP subjects
insert into public.subjects (name, code, color_hex) values
  ('Mathematics', 'MATH', '#0E7C3A'),
  ('English',     'ENG',  '#3B82F6'),
  ('Science',     'SCI',  '#A855F7'),
  ('Social Studies', 'SST', '#F59E0B')
on conflict (code) do nothing;

-- =====================================================================
-- Topics (organised by subject + grade + ECZ syllabus code)
-- =====================================================================
create table if not exists public.topics (
  id            uuid primary key default gen_random_uuid(),
  subject_id    uuid not null references public.subjects(id) on delete cascade,
  name          text not null,
  syllabus_code text,
  weight        integer not null default 1,
  grade         text not null,
  created_at    timestamptz not null default now()
);

create index if not exists topics_subject_grade_idx on public.topics (subject_id, grade);

-- =====================================================================
-- Subscriptions (one row per school per term/year)
-- =====================================================================
create table if not exists public.subscriptions (
  id              uuid primary key default gen_random_uuid(),
  school_id       uuid not null references public.schools(id) on delete cascade,
  plan            text not null check (plan in ('trial','standard','premium')),
  amount_kwacha   numeric(10,2) not null default 0,
  start_date      date not null,
  end_date        date not null,
  status          text not null default 'active' check (status in ('active','expired','cancelled')),
  payment_method  text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.handle_updated_at();

create index if not exists subscriptions_school_idx on public.subscriptions (school_id);

-- =====================================================================
-- Helper: create a school + link the calling user as school_admin
-- Called by the onboarding API after email confirmation.
-- SECURITY DEFINER so it runs as the table owner and bypasses RLS,
-- while still being callable by any authenticated user.
-- =====================================================================
create or replace function public.create_school_for_admin(
  p_school_name text,
  p_district    text default null,
  p_location    text default null,
  p_contact_name text default null,
  p_contact_phone text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_school_id uuid;
  v_slug text;
  v_full_name text;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Build a URL-safe slug from the school name
  v_slug := lower(regexp_replace(p_school_name, '[^a-zA-Z0-9]+', '-', 'g'));
  v_slug := trim(both '-' from v_slug);
  if v_slug = '' then
    v_slug := 'school-' || substr(v_user_id::text, 1, 8);
  end if;

  -- Ensure slug uniqueness by appending a short suffix if needed
  while exists (select 1 from public.schools where slug = v_slug) loop
    v_slug := v_slug || '-' || substr(md5(random()::text), 1, 4);
  end loop;

  -- Pull the user's full_name from their auth metadata if not provided
  if p_contact_name is null or p_contact_name = '' then
    select coalesce(raw_user_meta_data->>'full_name', email)
      into v_full_name
      from auth.users
      where id = v_user_id;
  else
    v_full_name := p_contact_name;
  end if;

  -- Create the school
  insert into public.schools (name, slug, district, location, contact_name, contact_phone)
  values (p_school_name, v_slug, p_district, p_location, p_contact_name, p_contact_phone)
  returning id into v_school_id;

  -- Upsert the user profile with school_admin role + school_id
  insert into public.users (id, full_name, phone, role, school_id)
  values (v_user_id, v_full_name, p_contact_phone, 'school_admin', v_school_id)
  on conflict (id) do update set
    role = 'school_admin',
    school_id = v_school_id,
    updated_at = now();

  -- Create a 1-term trial subscription
  insert into public.subscriptions (school_id, plan, amount_kwacha, start_date, end_date, status)
  values (
    v_school_id,
    'trial',
    0,
    current_date,
    current_date + interval '4 months',
    'active'
  );

  return v_school_id;
end;
$$;

grant execute on function public.create_school_for_admin to authenticated;

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.schools      enable row level security;
alter table public.users        enable row level security;
alter table public.subjects     enable row level security;
alter table public.topics       enable row level security;
alter table public.subscriptions enable row level security;

-- Subjects + Topics: readable by everyone (no sensitive data, needed for browsing)
create policy "subjects are viewable by everyone"
  on public.subjects for select
  using (true);

create policy "topics are viewable by everyone"
  on public.topics for select
  using (true);

-- Users: can read/update their own row; can read others in the same school
create policy "users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "users can view same-school profiles"
  on public.users for select
  using (
    school_id is not null
    and school_id = (select school_id from public.users where id = auth.uid())
  );

create policy "users can update own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Schools: can read own school; can update own school if school_admin
create policy "users can view own school"
  on public.schools for select
  using (
    id = (select school_id from public.users where id = auth.uid())
  );

create policy "school admins can update own school"
  on public.schools for update
  using (
    id = (select school_id from public.users where id = auth.uid() and role = 'school_admin')
  )
  with check (
    id = (select school_id from public.users where id = auth.uid() and role = 'school_admin')
  );

-- Subscriptions: only the school_admin of the school can view their school's subs
create policy "school admins can view own subscriptions"
  on public.subscriptions for select
  using (
    school_id = (select school_id from public.users where id = auth.uid() and role = 'school_admin')
  );

-- =====================================================================
-- Done. Verify with: select * from public.subjects;
-- =====================================================================
