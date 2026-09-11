"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, X, RefreshCw } from "lucide-react";

type Question = {
  id: string;
  type: "mcq" | "short";
  content: string;
  points: number;
  difficulty: number;
  topic_label: string | null;
  grade: string;
  subject_name: string;
  subject_code: string;
};

type Option = {
  id: string;
  text: string;
  option_order: number;
};

type GradeResult = {
  is_correct: boolean;
  score: number;
  similarity: number | null;
  ai_feedback: string;
  points: number;
};

export function PracticeClient({
  question,
  options,
}: {
  question: Question;
  options: Option[];
}) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [shortAnswer, setShortAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSubmitting(true);
    setError(null);

    const start = Date.now();

    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: question.id,
          answer_text: question.type === "short" ? shortAnswer : undefined,
          answer_option_id:
            question.type === "mcq" ? selectedOption : undefined,
          time_taken_sec: Math.round((Date.now() - start) / 1000),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to grade answer");
        return;
      }
      setResult(data);
    } catch (e) {
      setError("Network error — please try again");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="space-y-4">
        <div
          className={`rounded-xl p-5 border-2 ${
            result.is_correct
              ? "bg-brand-50 border-brand-300"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {result.is_correct ? (
              <Check className="w-5 h-5 text-brand-700" />
            ) : (
              <X className="w-5 h-5 text-red-600" />
            )}
            <div
              className={`font-bold ${
                result.is_correct ? "text-brand-900" : "text-red-900"
              }`}
            >
              {result.is_correct
                ? `Nice — ${result.points} ${
                    result.points === 1 ? "point" : "points"
                  } earned`
                : "Not quite"}
            </div>
            <div className="ml-auto text-sm font-medium">
              {Math.round(result.score)}%
            </div>
          </div>
          <p className="text-sm text-gray-800">{result.ai_feedback}</p>
          {result.similarity !== null && (
            <p className="text-xs text-gray-500 mt-2">
              AI similarity score: {Math.round(result.similarity * 100)}%
            </p>
          )}
        </div>

        <button
          onClick={() => router.push("/student/practice")}
          className="w-full bg-brand-700 text-white py-2.5 rounded-lg font-semibold hover:bg-brand-800 transition flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Next question
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {question.type === "mcq" && (
        <div className="space-y-2">
          {options.map((o) => (
            <label
              key={o.id}
              className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition ${
                selectedOption === o.id
                  ? "border-brand-500 bg-brand-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <input
                type="radio"
                name="option"
                value={o.id}
                checked={selectedOption === o.id}
                onChange={() => setSelectedOption(o.id)}
                className="mt-1 w-4 h-4 text-brand-700 focus:ring-brand-500"
              />
              <span className="text-gray-900">{o.text}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === "short" && (
        <div>
          <label
            htmlFor="answer"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your answer
          </label>
          <textarea
            id="answer"
            rows={4}
            value={shortAnswer}
            onChange={(e) => setShortAnswer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Type your answer here..."
          />
          <p className="text-xs text-gray-500 mt-1">
            The AI compares your answer against the mark scheme using semantic
            similarity. Write naturally.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      <button
        onClick={submit}
        disabled={
          submitting ||
          (question.type === "mcq" && !selectedOption) ||
          (question.type === "short" && !shortAnswer.trim())
        }
        className="w-full bg-brand-700 text-white py-2.5 rounded-lg font-semibold hover:bg-brand-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {submitting ? "Grading..." : "Submit answer"}
      </button>
    </div>
  );
}
