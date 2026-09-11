-- ZedPrep migration 0004
-- Step 4: Student attempts table + embedding columns on questions
--
-- - attempts: every answer a student submits, with AI feedback + score
-- - mark_scheme_embedding: precomputed OpenAI embedding for short-answer questions
-- - embedding_model: which model produced the embedding (so we can re-embed if we switch)

-- =====================================================================
-- Enable pgvector extension (required for vector columns)
-- =====================================================================
create extension if not exists vector;

-- =====================================================================
-- Embedding columns on questions
-- =====================================================================
alter table public.questions
  add column if not exists mark_scheme_embedding vector(1536),
  add column if not exists embedding_model text;

create index if not exists questions_embedding_idx
  on public.questions
  using ivfflat (mark_scheme_embedding vector_cosine_ops)
  with (lists = 100);

-- =====================================================================
-- Attempts: every answer a student submits
-- =====================================================================
create table if not exists public.attempts (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.users(id) on delete cascade,
  question_id       uuid not null references public.questions(id) on delete cascade,
  school_id         uuid not null references public.schools(id) on delete cascade,
  mode              text not null default 'practice' check (mode in ('practice', 'simulated_exam', 'past_paper')),
  exam_id           uuid,
  answer_text       text,
  answer_option_id  uuid references public.question_options(id) on delete set null,
  is_correct        boolean,
  score             numeric(5,2) check (score >= 0 and score <= 100),
  similarity        numeric(5,4),
  ai_feedback       text,
  time_taken_sec    int,
  attempted_at      timestamptz not null default now()
);

create index if not exists attempts_user_idx on public.attempts (user_id, attempted_at desc);
create index if not exists attempts_question_idx on public.attempts (question_id);
create index if not exists attempts_school_idx on public.attempts (school_id);

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.attempts enable row level security;

-- Students can insert their own attempts (the AI grading happens server-side
-- and the row is inserted with is_correct/score already filled in)
create policy "students can insert own attempts"
  on public.attempts for insert
  with check (
    user_id = auth.uid()
    and school_id = public.get_my_school_id()
    and public.get_my_role() = 'student'
  );

-- Students can read their own attempts
create policy "students can view own attempts"
  on public.attempts for select
  using (user_id = auth.uid());

-- School admins can read attempts for their school's students
create policy "school admins can view school attempts"
  on public.attempts for select
  using (
    school_id = public.get_my_school_id()
    and public.get_my_role() = 'school_admin'
  );

-- Teachers can read attempts for questions they created
create policy "teachers can view attempts on their questions"
  on public.attempts for select
  using (
    question_id in (
      select id from public.questions where created_by = auth.uid()
    )
  );

-- =====================================================================
-- Done. Verify with: select count(*) from public.attempts;  -- should be 0
-- =====================================================================
