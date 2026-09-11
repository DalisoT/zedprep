-- ZedPrep migration 0003
-- Step 3: Questions + teacher invites
--
-- Tables:
--   - questions (denormalised with school_id for simple RLS)
--   - question_options (for MCQ)
--   - teacher_invites (token-based invites, created by school admin)
--
-- All RLS policies use the SECURITY DEFINER helpers (get_my_school_id and
-- get_my_role) to avoid the recursion bug from migration 0001.

-- =====================================================================
-- Helper: get the caller's role without triggering users RLS recursion
-- =====================================================================
create or replace function public.get_my_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.users where id = auth.uid();
$$;

grant execute on function public.get_my_role to authenticated;

-- =====================================================================
-- Questions
-- school_id is denormalised onto questions so RLS stays simple.
-- =====================================================================
create table if not exists public.questions (
  id                uuid primary key default gen_random_uuid(),
  school_id         uuid not null references public.schools(id) on delete cascade,
  type              text not null check (type in ('mcq', 'short')),
  subject_id        uuid not null references public.subjects(id),
  topic_id          uuid references public.topics(id),
  grade             text not null,
  content           text not null,
  mark_scheme       text,
  points            int not null default 1,
  difficulty        int not null default 2 check (difficulty between 1 and 3),
  source            text,
  year              int,
  paper_ref         text,
  topic_label       text,           -- free-text topic name (used until topics dropdown exists)
  status            text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_by        uuid not null references public.users(id),
  reviewed_by       uuid references public.users(id),
  reviewed_at       timestamptz,
  rejection_reason  text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger questions_updated_at
  before update on public.questions
  for each row execute function public.handle_updated_at();

create index if not exists questions_school_idx on public.questions (school_id);
create index if not exists questions_status_idx on public.questions (status);
create index if not exists questions_subject_grade_idx on public.questions (subject_id, grade);

-- =====================================================================
-- Question options (for MCQ)
-- =====================================================================
create table if not exists public.question_options (
  id              uuid primary key default gen_random_uuid(),
  question_id     uuid not null references public.questions(id) on delete cascade,
  text            text not null,
  is_correct      boolean not null default false,
  order           int not null
);

create index if not exists question_options_question_idx on public.question_options (question_id);

-- =====================================================================
-- Teacher invites
-- =====================================================================
create table if not exists public.teacher_invites (
  id              uuid primary key default gen_random_uuid(),
  school_id       uuid not null references public.schools(id) on delete cascade,
  email           text not null,
  full_name       text,
  token           text unique not null,
  invited_by      uuid not null references public.users(id),
  accepted_by     uuid references public.users(id),
  accepted_at     timestamptz,
  expires_at      timestamptz not null default (now() + interval '14 days'),
  created_at      timestamptz not null default now()
);

create index if not exists teacher_invites_token_idx on public.teacher_invites (token);
create index if not exists teacher_invites_school_idx on public.teacher_invites (school_id);

-- =====================================================================
-- accept_teacher_invite(token) — called from /invite/[token] after signup
-- Marks the invite as accepted and returns the school_id.
-- SECURITY DEFINER so it runs as the table owner regardless of RLS.
-- =====================================================================
create or replace function public.accept_teacher_invite(p_token text)
returns table(school_id uuid, school_name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_school_id uuid;
  v_school_name text;
begin
  select ti.school_id, s.name
    into v_school_id, v_school_name
    from public.teacher_invites ti
    join public.schools s on s.id = ti.school_id
    where ti.token = p_token
      and ti.accepted_at is null
      and ti.expires_at > now();

  if v_school_id is null then
    raise exception 'Invite is invalid or has expired';
  end if;

  update public.teacher_invites
    set accepted_at = now(),
        accepted_by = auth.uid()
    where token = p_token
      and accepted_at is null;

  return query select v_school_id, v_school_name;
end;
$$;

grant execute on function public.accept_teacher_invite to authenticated;

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.questions        enable row level security;
alter table public.question_options enable row level security;
alter table public.teacher_invites  enable row level security;

-- ---------- questions ----------

-- Everyone in the school can see all questions (helps teachers avoid duplicates)
create policy "school members can view school questions"
  on public.questions for select
  using (school_id = public.get_my_school_id());

-- Teachers can create questions (status defaults to pending)
create policy "teachers can create questions"
  on public.questions for insert
  with check (
    created_by = auth.uid()
    and school_id = public.get_my_school_id()
    and public.get_my_role() in ('teacher', 'school_admin')
  );

-- School admins can update questions (mainly for moderation status changes)
create policy "school admins can update questions"
  on public.questions for update
  using (
    school_id = public.get_my_school_id()
    and public.get_my_role() = 'school_admin'
  )
  with check (
    school_id = public.get_my_school_id()
  );

-- ---------- question_options ----------

-- School members can view options for their school's questions
create policy "school members can view question options"
  on public.question_options for select
  using (
    exists (
      select 1 from public.questions q
      where q.id = question_options.question_id
        and q.school_id = public.get_my_school_id()
    )
  );

-- Teachers can create options for questions they created
create policy "teachers can create options"
  on public.question_options for insert
  with check (
    exists (
      select 1 from public.questions q
      where q.id = question_options.question_id
        and q.created_by = auth.uid()
        and q.school_id = public.get_my_school_id()
    )
  );

-- School admins can update options (during moderation edits)
create policy "school admins can update options"
  on public.question_options for update
  using (
    exists (
      select 1 from public.questions q
      where q.id = question_options.question_id
        and q.school_id = public.get_my_school_id()
        and public.get_my_role() = 'school_admin'
    )
  );

-- ---------- teacher_invites ----------

-- Anyone can read an invite by token (needed for the invite acceptance page)
-- The token is unguessable so this doesn't expose anything sensitive.
create policy "invites are readable by token"
  on public.teacher_invites for select
  using (true);

-- School admins can list their own school's invites (without exposing tokens)
create policy "school admins can view own invites"
  on public.teacher_invites for select
  using (
    school_id = public.get_my_school_id()
    and public.get_my_role() = 'school_admin'
  );

-- School admins can create invites for their school
create policy "school admins can create invites"
  on public.teacher_invites for insert
  with check (
    school_id = public.get_my_school_id()
    and public.get_my_role() = 'school_admin'
  );

-- =====================================================================
-- Done. Verify with: select count(*) from public.questions;  -- should be 0
-- =====================================================================
