# Supabase — ZedPrep

## What's here

- `migrations/0001_initial_schema.sql` — the first database migration (tables, RLS policies, helper functions)

## How to apply the initial migration

1. Open the Supabase SQL editor for the ZedPrep project:
   <https://supabase.com/dashboard/project/jkfzanjcganzhhmmwcxh/sql>
2. Click **New query**
3. Open `migrations/0001_initial_schema.sql` in this folder, copy the entire contents, and paste into the SQL editor
4. Click **Run** (or press Ctrl+Enter)
5. You should see "Success. No rows returned" — that's the expected outcome (DDL doesn't return rows)
6. Verify by running `select * from public.subjects;` — you should see 4 rows: Mathematics, English, Science, Social Studies

## What this migration creates

| Object | Purpose |
|---|---|
| `schools` | One row per school. Holds name, location, plan, status. |
| `users` | Profile layer on top of `auth.users`. Holds role, school_id, grade, name. |
| `subjects` | The 4 MVP subjects (Maths, English, Science, Social Studies), seeded. |
| `topics` | Empty for now. Teachers add topics in Step 3 (teacher upload tool). |
| `subscriptions` | Tracks each school's plan + billing period. |
| `create_school_for_admin(...)` | SECURITY DEFINER function called from the app to onboard a new school in a single RPC. |
| `get_my_school_id()` | SECURITY DEFINER helper that returns the caller's `school_id` without triggering RLS recursion. Used by the "users can view same-school profiles" policy. |
| `handle_updated_at()` | Trigger function that auto-updates `updated_at` columns. |
| RLS policies | Restricts each user to their own school's data. |

## What's NOT in this migration (deliberately)

These tables are in the BUILD_PLAN §9 schema but are added in later steps when we need them:

- `questions`, `question_options`, `question_images` — Step 3 (teacher upload tool)
- `attempts`, `simulated_exams` — Step 4-5 (student PWA + simulated exam)
- `parent_child_links` — Step 5-6 (parent WhatsApp digest)
- `payments` — Step 6 (MTN MoMo integration)
- `notifications` — Step 7 (WhatsApp + SMS)
- `teacher_uploads` — Step 3 (teacher upload tool)
- `audit_logs` — Phase 2 (when we need it for security review)

Adding them now would just be dead code. We add them when the app needs to read/write to them.

## Auth flow in the app

1. User signs up at `/signup` (email + password)
2. Supabase sends a confirmation email
3. User clicks the link, gets logged in
4. App redirects to `/onboarding` (school details form)
5. User submits school name + district + contact info
6. App calls `public.create_school_for_admin(...)` — this is a SECURITY DEFINER function that:
   - Creates the `schools` row
   - Upserts the `users` row (sets role to `school_admin`, links to the new school)
   - Creates a 4-month trial `subscriptions` row
7. App redirects to `/dashboard` showing the school name + a welcome message

## Connection

The app reads these from `.env.local` (already populated, git-ignored):

```
NEXT_PUBLIC_SUPABASE_URL=https://jkfzanjcganzhhmmwcxh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<the anon key you set>
```

If you ever need the service role key (for admin operations), get it from the Supabase dashboard and add it to `.env.local` as `SUPABASE_SERVICE_ROLE_KEY=...`. **Never** commit it. **Never** expose it to the client.
