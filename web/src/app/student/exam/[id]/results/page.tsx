import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, CheckCircle2, XCircle, Clock, Award } from "lucide-react";
import { LogoutButton } from "@/app/dashboard/logout-button";

export default async function ExamResultsPage({
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
    .select("role, school_id, full_name, grade")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "student") {
    redirect("/dashboard");
  }

  // Fetch the exam + subject
  const { data: exam } = await supabase
    .from("simulated_exams")
    .select(
      "id, status, total_score, time_taken_sec, started_at, completed_at, question_count, subjects(name)"
    )
    .eq("id", params.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!exam) {
    notFound();
  }

  if (exam.status === "in_progress") {
    redirect(`/student/exam/${params.id}/take`);
  }

  // Fetch per-question results
  const { data: attempts } = await supabase
    .from("attempts")
    .select(
      "id, is_correct, score, similarity, question_id, questions(id, type, content, mark_scheme, question_options(id, text, is_correct, option_order))"
    )
    .eq("exam_id", params.id)
    .eq("user_id", user.id);

  const correctCount = attempts?.filter((a) => a.is_correct).length ?? 0;
  const totalQ = attempts?.length ?? 0;
  const totalScore = Number(exam.total_score ?? 0);
  const maxScore = totalQ * 100;
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const subject = Array.isArray(exam.subjects)
    ? exam.subjects[0]
    : exam.subjects;

  function formatDuration(seconds: number | null) {
    if (!seconds) return "—";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/student" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <span className="font-bold text-lg text-gray-900">ZedPrep</span>
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/student"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        {/* Score card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 text-center">
          <Award className="w-12 h-12 text-brand-700 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {percentage}%
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            {subject?.name ?? "Exam"} · {correctCount} of {totalQ} correct
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <div>
              <div className="text-xs text-gray-500">Time taken</div>
              <div className="font-semibold text-gray-900">
                {formatDuration(exam.time_taken_sec)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Score</div>
              <div className="font-semibold text-gray-900">
                {Math.round(totalScore)} pts
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Questions</div>
              <div className="font-semibold text-gray-900">{totalQ}</div>
            </div>
          </div>
        </div>

        {/* Per-question breakdown */}
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Question-by-question
        </h2>
        <div className="space-y-3">
          {attempts?.map((a, i) => {
            const q = Array.isArray(a.questions)
              ? a.questions[0]
              : a.questions;
            const options = Array.isArray(q?.question_options)
              ? q.question_options
              : [];
            const correctOption = options.find((o) => o.is_correct);
            const userOption = options.find(
              (o) => o.id === attempts?.[i]?.question_id && o.id === correctOption?.id
            );
            return (
              <div
                key={a.id}
                className={`border rounded-xl p-4 ${
                  a.is_correct
                    ? "bg-brand-50 border-brand-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  {a.is_correct ? (
                    <CheckCircle2 className="w-5 h-5 text-brand-700 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">
                      Question {i + 1} · {q?.type === "mcq" ? "MCQ" : "Short answer"}
                    </div>
                    <p className="text-gray-900 text-sm">{q?.content}</p>
                    {q?.type === "mcq" && correctOption && (
                      <p className="text-xs text-gray-700 mt-2">
                        <strong>Correct answer:</strong> {correctOption.text}
                      </p>
                    )}
                    {q?.type === "short" && q?.mark_scheme && (
                      <p className="text-xs text-gray-700 mt-2 bg-white border border-gray-200 rounded p-2">
                        <strong>Mark scheme:</strong> {q.mark_scheme}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Score: {Math.round(a.score ?? 0)} pts
                      {a.similarity !== null &&
                        ` · AI similarity: ${Math.round(a.similarity * 100)}%`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/student/exam"
            className="inline-block bg-brand-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-800 transition"
          >
            Take another exam
          </Link>
        </div>
      </main>
    </div>
  );
}
