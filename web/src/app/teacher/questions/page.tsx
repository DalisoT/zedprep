import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react";
import { LogoutButton } from "@/app/dashboard/logout-button";

const STATUS_LABEL: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  pending: {
    label: "Pending review",
    color: "bg-amber-50 text-amber-800 border-amber-200",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: "bg-brand-50 text-brand-800 border-brand-200",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-50 text-red-800 border-red-200",
    icon: XCircle,
  },
};

export default async function MyQuestionsPage() {
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

  if (!profile || (profile.role !== "teacher" && profile.role !== "school_admin")) {
    redirect("/dashboard");
  }

  const { data: questions } = await supabase
    .from("questions")
    .select("id, type, content, grade, status, created_at, rejection_reason, subjects(name)")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

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

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/teacher"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to teacher portal
        </Link>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">My questions</h1>
            <p className="text-sm text-gray-600">
              {questions?.length ?? 0} submitted
            </p>
          </div>
          <Link
            href="/teacher/questions/new"
            className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-800 transition"
          >
            Submit another
          </Link>
        </div>

        {!questions || questions.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <p className="text-gray-600 mb-4">
              You haven&apos;t submitted any questions yet.
            </p>
            <Link
              href="/teacher/questions/new"
              className="inline-block bg-brand-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-800 transition"
            >
              Submit your first question
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q) => {
              const meta = STATUS_LABEL[q.status] ?? STATUS_LABEL.pending;
              const Icon = meta.icon;
              const subject = Array.isArray(q.subjects)
                ? q.subjects[0]
                : q.subjects;
              return (
                <div
                  key={q.id}
                  className="bg-white border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="text-xs text-gray-500">
                      {subject?.name ?? "—"} · {q.grade} ·{" "}
                      {q.type === "mcq" ? "MCQ" : "Short answer"}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${meta.color}`}
                    >
                      <Icon className="w-3 h-3" />
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-gray-900 text-sm line-clamp-3">
                    {q.content}
                  </p>
                  {q.status === "rejected" && q.rejection_reason && (
                    <p className="mt-2 text-xs text-red-700 bg-red-50 border border-red-100 rounded p-2">
                      Rejected: {q.rejection_reason}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
