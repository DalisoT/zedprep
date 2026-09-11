import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BookOpen, FileEdit, Plus, LogOut } from "lucide-react";
import { LogoutButton } from "@/app/dashboard/logout-button";

export default async function TeacherPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, full_name, role, school_id, schools(name)")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/login");
  }

  if (profile.role !== "teacher" && profile.role !== "school_admin") {
    redirect("/dashboard");
  }

  // Count of teacher's submitted questions
  const { count: questionCount } = await supabase
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("created_by", user.id);

  const school = Array.isArray(profile.schools)
    ? profile.schools[0]
    : profile.schools;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/teacher" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <span className="font-bold text-lg text-gray-900">ZedPrep</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {profile.full_name}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome, {profile.full_name}
          </h1>
          <p className="text-gray-600">
            Teacher at <strong>{school?.name}</strong>. Your questions go to
            your school admin for review before going live.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Link
            href="/teacher/questions/new"
            className="bg-brand-700 text-white rounded-xl p-5 hover:bg-brand-800 transition flex items-start gap-4"
          >
            <Plus className="w-8 h-8 flex-shrink-0" />
            <div>
              <div className="font-semibold text-lg mb-1">Submit a question</div>
              <div className="text-brand-100 text-sm">
                Add an MCQ or short-answer question for review
              </div>
            </div>
          </Link>

          <Link
            href="/teacher/questions"
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-brand-300 transition flex items-start gap-4"
          >
            <FileEdit className="w-8 h-8 text-brand-700 flex-shrink-0" />
            <div>
              <div className="font-semibold text-lg text-gray-900 mb-1">
                My questions
              </div>
              <div className="text-gray-600 text-sm">
                {questionCount ?? 0} submitted so far
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-accent-50 border border-accent-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-accent-700 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-800">
              <strong>Step 3 (teacher upload tool) is live.</strong> The next
              step after this is the student PWA — once your school admin
              approves a few questions, students can start practising.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
