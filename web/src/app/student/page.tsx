import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Play, BookOpen, BarChart3, GraduationCap } from "lucide-react";
import { LogoutButton } from "@/app/dashboard/logout-button";

export default async function StudentPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, full_name, role, school_id, grade, schools(name)")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/login");
  }

  // Allow if role is student OR school_admin (admin might want to see student view)
  if (profile.role !== "student" && profile.role !== "school_admin") {
    redirect("/dashboard");
  }

  // If student but no school (shouldn't happen but guard), redirect to signup
  if (!profile.school_id) {
    redirect("/student/signup");
  }

  // Get subjects with approved question counts for this school
  const { data: subjectStats } = await supabase
    .from("questions")
    .select("subject_id, subjects(id, name, code)")
    .eq("school_id", profile.school_id)
    .eq("status", "approved");

  const subjectMap = new Map<string, { name: string; code: string; count: number }>();
  for (const row of subjectStats ?? []) {
    const s = Array.isArray(row.subjects) ? row.subjects[0] : row.subjects;
    if (!s) continue;
    if (!subjectMap.has(s.id)) {
      subjectMap.set(s.id, { name: s.name, code: s.code, count: 0 });
    }
    subjectMap.get(s.id)!.count++;
  }

  const subjects = Array.from(subjectMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Recent attempts
  const { data: recentAttempts } = await supabase
    .from("attempts")
    .select("id, is_correct, score, attempted_at, questions(content, subjects(name))")
    .eq("user_id", user.id)
    .order("attempted_at", { ascending: false })
    .limit(5);

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

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome, {profile.full_name}
          </h1>
          <p className="text-gray-600">
            <strong>{school?.name}</strong> · {profile.grade}
          </p>
        </div>

        {/* CTAs: Practice + Simulated exam */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Link
            href="/student/practice"
            className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-brand-300 transition flex items-center gap-4"
          >
            <Play className="w-8 h-8 text-brand-700 flex-shrink-0" />
            <div>
              <div className="font-bold text-lg text-gray-900 mb-1">Practice</div>
              <div className="text-gray-600 text-sm">
                Random approved question
              </div>
            </div>
          </Link>
          <Link
            href="/student/exam"
            className="bg-brand-700 text-white rounded-2xl p-5 hover:bg-brand-800 transition flex items-center gap-4"
          >
            <GraduationCap className="w-8 h-8 flex-shrink-0" />
            <div>
              <div className="font-bold text-lg mb-1">Simulated exam</div>
              <div className="text-brand-100 text-sm">
                20 questions · 30 min timer
              </div>
            </div>
          </Link>
        </div>

        {/* Subjects grid */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-700" />
            Subjects with questions
          </h2>
          {subjects.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500">
              <p>No approved questions yet.</p>
              <p className="text-sm mt-1">
                Ask your teacher to submit some questions and have your school
                admin approve them.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {subjects.map((s) => (
                <div
                  key={s.code}
                  className="bg-white border border-gray-200 rounded-xl p-4 text-center"
                >
                  <div className="font-semibold text-gray-900 text-sm">
                    {s.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {s.count} question{s.count !== 1 ? "s" : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-700" />
            Recent activity
          </h2>
          {!recentAttempts || recentAttempts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-gray-500 text-sm">
              You haven&apos;t answered any questions yet.
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100">
              {recentAttempts.map((a) => {
                const q = Array.isArray(a.questions)
                  ? a.questions[0]
                  : a.questions;
                const s = q
                  ? Array.isArray(q.subjects)
                    ? q.subjects[0]
                    : q.subjects
                  : null;
                return (
                  <div
                    key={a.id}
                    className="p-4 flex items-start justify-between gap-3"
                  >
                    <div className="text-sm text-gray-700 line-clamp-2 flex-1">
                      {s?.name ?? "—"} · {q?.content ?? "(question removed)"}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div
                        className={`text-sm font-bold ${
                          a.is_correct ? "text-brand-700" : "text-red-600"
                        }`}
                      >
                        {Math.round(a.score ?? 0)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(a.attempted_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
