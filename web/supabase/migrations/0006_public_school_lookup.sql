-- ZedPrep migration 0006
-- Public school lookup for student signup
--
-- The student signup page (/student/signup) needs to look up a school by
-- its slug BEFORE the student is logged in. RLS blocks anon reads of
-- public.schools (only members of the school can read its row).
--
-- We add a SECURITY DEFINER function that returns only the minimal
-- fields needed for the signup UI (id + name), and grant it to anon +
-- authenticated. This is safer than a blanket SELECT policy because
-- it does not expose contact info, plan, status, etc.

create or replace function public.find_school_by_slug(p_slug text)
returns table(id uuid, name text)
language sql
security definer
set search_path = public
stable
as $$
  select id, name
  from public.schools
  where slug = p_slug
  limit 1;
$$;

grant execute on function public.find_school_by_slug to anon, authenticated;

-- Remove the overly-permissive policy from 0006 hotfix (if you ran it).
-- Safe to run even if the policy doesn't exist.
drop policy if exists "anyone can read schools for signup lookup" on public.schools;
