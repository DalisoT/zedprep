import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import { LogoutButton } from "@/app/dashboard/logout-button";
import { NewQuestionForm } from "./new-question-form";

export default async function NewQuestionPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role, school_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || (profile.role !== "teacher" && profile.role !== "school_admin")) {
    redirect("/dashboard");
  }

  // Load subjects for the dropdown
  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name, code")
    .order("name");

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
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/teacher"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to teacher portal
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Submit a new question
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Your question goes to your school admin for review. Once approved
          it&apos;s live for students to practise on.
        </p>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <NewQuestionForm
            schoolId={profile.school_id!}
            subjects={subjects ?? []}
          />
        </div>
      </main>
    </div>
  );
}
