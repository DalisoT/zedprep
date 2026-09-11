import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ExamTaker } from "./exam-taker";

export default async function TakeExamPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "student") {
    redirect("/dashboard");
  }

  // Fetch exam + questions in order
  const { data: exam } = await supabase
    .from("simulated_exams")
    .select(
      "id, status, started_at, duration_min, question_count, subjects(name, code)"
    )
    .eq("id", params.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!exam) {
    notFound();
  }

  if (exam.status !== "in_progress") {
    redirect(`/student/exam/${params.id}/results`);
  }

  const { data: examQuestions } = await supabase
    .from("simulated_exam_questions")
    .select(
      "order_index, questions(id, type, content, points, mark_scheme, question_options(id, text, option_order))"
    )
    .eq("exam_id", params.id)
    .order("order_index", { ascending: true });

  if (!examQuestions || examQuestions.length === 0) {
    notFound();
  }

  // Strip mark_scheme from the student payload (server-side only)
  const safeQuestions = examQuestions.map((eq) => {
    const q = Array.isArray(eq.questions) ? eq.questions[0] : eq.questions;
    return {
      id: q.id,
      type: q.type,
      content: q.content,
      points: q.points,
      options: (Array.isArray(q.question_options)
        ? q.question_options
        : []
      )
        .map((o) => ({ id: o.id, text: o.text, option_order: o.option_order }))
        .sort((a, b) => a.option_order - b.option_order),
    };
  });

  const subject = Array.isArray(exam.subjects)
    ? exam.subjects[0]
    : exam.subjects;

  return (
    <ExamTaker
      examId={exam.id}
      startedAt={exam.started_at}
      durationMin={exam.duration_min}
      subjectName={subject?.name ?? "Subject"}
      questions={safeQuestions}
    />
  );
}
