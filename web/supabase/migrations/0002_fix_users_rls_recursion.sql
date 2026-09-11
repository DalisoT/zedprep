-- ZedPrep migration 0002
-- Fix: infinite recursion in RLS policy on public.users
--
-- The previous policy queried public.users from within a policy ON public.users,
-- which Postgres detects and aborts with SQLSTATE 42P17. The fix is to wrap
-- the inner lookup in a SECURITY DEFINER function so it bypasses RLS, breaking
-- the recursion.

-- =====================================================================
-- Step 1: Drop the recursive policy
-- =====================================================================
drop policy if exists "users can view same-school profiles" on public.users;

-- =====================================================================
-- Step 2: Create a SECURITY DEFINER helper that returns the caller's school_id
-- SECURITY DEFINER means the function runs as the function owner (postgres),
-- which bypasses RLS on public.users — so it can SELECT from users without
-- triggering the policy that's currently being evaluated.
-- =====================================================================
create or replace function public.get_my_school_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select school_id from public.users where id = auth.uid();
$$;

grant execute on function public.get_my_school_id to authenticated;

-- =====================================================================
-- Step 3: Re-create the policy using the helper function
-- The helper bypasses RLS, so this policy no longer recurses.
-- =====================================================================
create policy "users can view same-school profiles"
  on public.users for select
  using (
    school_id is not null
    and school_id = public.get_my_school_id()
  );

-- =====================================================================
-- Done. The dashboard query against public.users should now succeed.
-- =====================================================================
