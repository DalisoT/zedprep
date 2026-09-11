import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Play } from "lucide-react";
import { LogoutButton } from "@/app/dashboard/logout-button";
import { PracticeClient } from "./practice-client";

export default async function PracticePage({
  searchParams,
}: {
  searchParams: { subject?: string; grade?: string };
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
    .select("role, school_id, grade")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "student") {
    redirect("/dashboard");
  }

  // Fetch a random approved question for this school
  // Filter by grade if set, otherwise use the student's grade
  const grade = searchParams.grade ?? profile.grade ?? "Form 4";

  const { data: questions } = await supabase
    .from("questions")
    .select("id")
    .eq("school_id", profile.school_id)
    .eq("status", "approved")
    .eq("grade", grade);

  if (!questions || questions.length === 0) {
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
        <main className="max-w-2xl mx-auto px-4 py-8">
          <Link
            href="/student"
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <p className="text-gray-600">
              No approved questions for {grade} yet.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Ask your teacher to submit some.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Pick a random question
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

  // Fetch the full question + options
  const { data: question } = await supabase
    .from("questions")
    .select(
      "id, type, content, mark_scheme, points, difficulty, topic_label, grade, subjects(name, code)"
    )
    .eq("id", randomQuestion.id)
    .single();

  if (!question) {
    redirect("/student");
  }

  let options: Array<{ id: string; text: string; option_order: number }> = [];
  if (question.type === "mcq") {
    const { data: opts } = await supabase
      .from("question_options")
      .select("id, text, option_order")
      .eq("question_id", question.id)
      .order("option_order", { ascending: true });
    options = opts ?? [];
  }

  const subject = Array.isArray(question.subjects)
    ? question.subjects[0]
    : question.subjects;

  // Don't expose mark_scheme to students; only used server-side for grading
  const safeQuestion = {
    id: question.id,
    type: question.type,
    content: question.content,
    points: question.points,
    difficulty: question.difficulty,
    topic_label: question.topic_label,
    grade: question.grade,
    subject_name: subject?.name ?? "Unknown",
    subject_code: subject?.code ?? "",
  };

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

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="text-sm text-gray-600">
              <strong>{safeQuestion.subject_name}</strong> ·{" "}
              {safeQuestion.grade} · Difficulty {safeQuestion.difficulty}/3
              {safeQuestion.topic_label && ` · ${safeQuestion.topic_label}`}
            </div>
            <div className="text-sm font-bold text-brand-700 flex-shrink-0">
              {safeQuestion.points} pt{safeQuestion.points !== 1 ? "s" : ""}
            </div>
          </div>

          <p className="text-lg text-gray-900 mb-6">{safeQuestion.content}</p>

          <PracticeClient
            question={safeQuestion}
            options={options}
          />
        </div>
      </main>
    </div>
  );
}
