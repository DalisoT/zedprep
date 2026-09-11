"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Play } from "lucide-react";

type Subject = { id: string; name: string; count: number };

export function ExamStartForm({ subjects }: { subjects: Subject[] }) {
  const router = useRouter();
  const [subjectId, setSubjectId] = useState(
    subjects[0]?.id ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject_id: subjectId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to start exam");
        setLoading(false);
        return;
      }

      router.push(`/student/exam/${data.exam_id}/take`);
    } catch (e) {
      setError("Network error — please try again");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Choose a subject
        </label>
        <select
          id="subject"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          required
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id} disabled={s.count < 20}>
              {s.name} ({s.count} question{s.count !== 1 ? "s" : ""} available
              {s.count < 20 ? " — need 20 to start" : ""})
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Only subjects with at least 20 approved questions are pickable.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-700 text-white py-3 rounded-lg font-semibold hover:bg-brand-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Starting exam...
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Start exam
          </>
        )}
      </button>
    </form>
  );
}
