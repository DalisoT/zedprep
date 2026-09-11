import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_QUESTION_COUNT = 20;
const DEFAULT_DURATION_MIN = 30;

export async function POST(request: Request) {
  const supabase = createClient();

  // 1. Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 2. Parse body
  let body: { subject_id?: string; question_count?: number; duration_min?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.subject_id) {
    return NextResponse.json(
      { error: "subject_id is required" },
      { status: 400 }
    );
  }

  const questionCount = Math.min(
    Math.max(body.question_count ?? DEFAULT_QUESTION_COUNT, 1),
    50
  );
  const durationMin = Math.min(
    Math.max(body.duration_min ?? DEFAULT_DURATION_MIN, 1),
    180
  );

  // 3. Get the student's profile (school + grade)
  const { data: profile } = await supabase
    .from("users")
    .select("school_id, grade, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "student" || !profile.school_id) {
    return NextResponse.json(
      { error: "Only students can start exams" },
      { status: 403 }
    );
  }

  // 4. Fetch the available approved questions for this subject + school + grade
  const { data: allQuestions } = await supabase
    .from("questions")
    .select("id")
    .eq("school_id", profile.school_id)
    .eq("subject_id", body.subject_id)
    .eq("status", "approved")
    .eq("grade", profile.grade);

  if (!allQuestions || allQuestions.length === 0) {
    return NextResponse.json(
      { error: "No approved questions for this subject and grade yet" },
      { status: 400 }
    );
  }

  if (allQuestions.length < questionCount) {
    return NextResponse.json(
      {
        error: `Only ${allQuestions.length} questions available — need at least ${questionCount}. Ask your teacher to add more.`,
      },
      { status: 400 }
    );
  }

  // 5. Shuffle and take N
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, questionCount);

  // 6. Create the exam
  const { data: exam, error: examError } = await supabase
    .from("simulated_exams")
    .insert({
      user_id: user.id,
      school_id: profile.school_id,
      subject_id: body.subject_id,
      grade: profile.grade,
      question_count: questionCount,
      duration_min: durationMin,
      status: "in_progress",
    })
    .select("id")
    .single();

  if (examError || !exam) {
    return NextResponse.json(
      { error: examError?.message ?? "Failed to create exam" },
      { status: 500 }
    );
  }

  // 7. Insert the question links
  const links = selected.map((q, i) => ({
    exam_id: exam.id,
    question_id: q.id,
    order_index: i,
  }));

  const { error: linkError } = await supabase
    .from("simulated_exam_questions")
    .insert(links);

  if (linkError) {
    return NextResponse.json(
      { error: linkError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ exam_id: exam.id });
}
