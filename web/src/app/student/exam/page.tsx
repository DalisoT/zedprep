import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GraduationCap, LogOut, ArrowLeft } from "lucide-react";
import { LogoutButton } from "@/app/dashboard/logout-button";
import { ExamStartForm } from "./exam-start-form";

export default async function ExamIntroPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, role, school_id, grade, full_name, schools(name)")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "student") {
    redirect("/dashboard");
  }

  // Load subjects that have approved questions for this student's grade
  const { data: subjectsWithCounts } = await supabase
    .from("questions")
    .select("subject_id, subjects(id, name, code)")
    .eq("school_id", profile.school_id)
    .eq("grade", profile.grade)
    .eq("status", "approved");

  const subjectMap = new Map<string, { id: string; name: string; count: number }>();
  for (const row of subjectsWithCounts ?? []) {
    const s = Array.isArray(row.subjects) ? row.subjects[0] : row.subjects;
    if (!s) continue;
    if (!subjectMap.has(s.id)) {
      subjectMap.set(s.id, { id: s.id, name: s.name, count: 0 });
    }
    subjectMap.get(s.id)!.count++;
  }

  const subjects = Array.from(subjectMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const school = Array.isArray(profile.schools)
    ? profile.schools[0]
    : profile.schools;

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
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {profile.full_name} · {profile.grade}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/student"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-5 h-5 text-brand-700" />
            <span className="text-sm font-medium text-brand-700">
              Simulated exam
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Test your exam readiness
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            A timed exam of 20 random questions from your school&apos;s question
            bank for {profile.grade}. You have 30 minutes. Once you start, the
            timer won&apos;t stop.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900 mb-4">
            <strong>Heads up:</strong> Your school{" "}
            <strong>{school?.name}</strong> needs at least <strong>20 approved
            questions</strong> in the subject you pick. If you see fewer
            options below, ask your teacher to add more.
          </div>

          {subjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No subjects have 20+ approved questions for {profile.grade} yet.</p>
              <p className="text-sm mt-1">
                Ask your teacher to submit more questions.
              </p>
            </div>
          ) : (
            <ExamStartForm subjects={subjects} />
          )}
        </div>
      </main>
    </div>
  );
}
