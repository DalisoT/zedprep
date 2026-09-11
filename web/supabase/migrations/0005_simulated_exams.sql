-- ZedPrep migration 0005
-- Step 5: Simulated exams
--
-- Tables:
--   - simulated_exams: one row per exam attempt by a student
--   - simulated_exam_questions: the questions in each exam, with order

-- =====================================================================
-- simulated_exams
-- =====================================================================
create table if not exists public.simulated_exams (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  school_id       uuid not null references public.schools(id) on delete cascade,
  subject_id      uuid not null references public.subjects(id) on delete cascade,
  grade           text not null,
  question_count  int not null default 20,
  duration_min    int not null default 30,
  status          text not null default 'in_progress' check (status in ('in_progress', 'completed', 'abandoned')),
  started_at      timestamptz not null default now(),
  completed_at    timestamptz,
  total_score     numeric(6,2),
  time_taken_sec  int
);

create index if not exists simulated_exams_user_idx
  on public.simulated_exams (user_id, started_at desc);

create index if not exists simulated_exams_school_idx
  on public.simulated_exams (school_id);

-- =====================================================================
-- simulated_exam_questions (linker: which questions are in which exam)
-- =====================================================================
create table if not exists public.simulated_exam_questions (
  exam_id         uuid not null references public.simulated_exams(id) on delete cascade,
  question_id     uuid not null references public.questions(id) on delete cascade,
  order_index     int not null,
  primary key (exam_id, question_id)
);

create index if not exists simulated_exam_questions_exam_idx
  on public.simulated_exam_questions (exam_id, order_index);

-- =====================================================================
-- RLS
-- =====================================================================
alter table public.simulated_exams enable row level security;
alter table public.simulated_exam_questions enable row level security;

-- Students can read their own exams
create policy "students can view own exams"
  on public.simulated_exams for select
  using (user_id = auth.uid());

-- Students can create their own exams
create policy "students can create own exams"
  on public.simulated_exams for insert
  with check (
    user_id = auth.uid()
    and school_id = public.get_my_school_id()
    and public.get_my_role() = 'student'
  );

-- Students can update their own in-progress exams (e.g. when completing)
create policy "students can update own exams"
  on public.simulated_exams for update
  using (user_id = auth.uid());

-- School admins can read all school exams
create policy "school admins can view school exams"
  on public.simulated_exams for select
  using (
    school_id = public.get_my_school_id()
    and public.get_my_role() = 'school_admin'
  );

-- Students can read the questions in their own exams
create policy "students can view own exam questions"
  on public.simulated_exam_questions for select
  using (
    exam_id in (
      select id from public.simulated_exams where user_id = auth.uid()
    )
  );

-- School admins can read questions in their school exams
create policy "school admins can view school exam questions"
  on public.simulated_exam_questions for select
  using (
    exam_id in (
      select id from public.simulated_exams
      where school_id = public.get_my_school_id()
    )
  );

-- =====================================================================
-- Done. Verify with: select count(*) from public.simulated_exams;  -- 0
-- =====================================================================
