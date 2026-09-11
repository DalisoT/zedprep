import { ClipboardCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ModerationActions } from "./moderation-actions";

export async function ModerationQueueSection({
  schoolId,
}: {
  schoolId: string;
}) {
  const supabase = createClient();

  // Fetch pending questions with creator + subject info
  const { data: pending } = await supabase
    .from("questions")
    .select(
      "id, type, content, grade, points, difficulty, mark_scheme, created_at, topic_label, subjects(name), users!questions_created_by_fkey(full_name)"
    )
    .eq("school_id", schoolId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardCheck className="w-5 h-5 text-brand-700" />
        <h2 className="text-lg font-semibold text-gray-900">
          Pending questions to review
        </h2>
        <span className="ml-auto text-sm text-gray-500">
          {pending?.length ?? 0} pending
        </span>
      </div>

      {!pending || pending.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No pending questions right now.</p>
          <p className="text-sm mt-1">
            When teachers submit questions, they&apos;ll show up here for
            review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((q) => {
            const subject = Array.isArray(q.subjects)
              ? q.subjects[0]
              : q.subjects;
            const creator = Array.isArray(q.users)
              ? q.users[0]
              : q.users;
            return (
              <div
                key={q.id}
                className="border border-gray-200 rounded-xl p-4 bg-gray-50"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="text-xs text-gray-600">
                    <strong>{creator?.full_name ?? "Unknown teacher"}</strong>
                    {" · "}
                    {subject?.name ?? "—"} · {q.grade} ·{" "}
                    {q.type === "mcq" ? "MCQ" : "Short answer"} ·{" "}
                    {q.points} pt{q.points !== 1 ? "s" : ""} · Difficulty{" "}
                    {q.difficulty}/3
                    {q.topic_label ? ` · ${q.topic_label}` : ""}
                  </div>
                </div>
                <p className="text-gray-900 mb-2">{q.content}</p>
                {q.mark_scheme && (
                  <p className="text-xs text-gray-600 bg-white border border-gray-200 rounded p-2 mb-3">
                    <strong>Mark scheme:</strong> {q.mark_scheme}
                  </p>
                )}
                <ModerationActions questionId={q.id} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
