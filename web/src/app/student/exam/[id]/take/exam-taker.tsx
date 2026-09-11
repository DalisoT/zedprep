"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ChevronLeft, ChevronRight, Send, Clock } from "lucide-react";

type Question = {
  id: string;
  type: "mcq" | "short";
  content: string;
  points: number;
  options: { id: string; text: string; option_order: number }[];
};

type Answer = {
  question_id: string;
  answer_text?: string;
  answer_option_id?: string;
};

export function ExamTaker({
  examId,
  startedAt,
  durationMin,
  subjectName,
  questions,
}: {
  examId: string;
  startedAt: string;
  durationMin: number;
  subjectName: string;
  questions: Question[];
}) {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    const start = new Date(startedAt).getTime();
    const end = start + durationMin * 60 * 1000;
    return Math.max(0, Math.floor((end - Date.now()) / 1000));
  });
  const submittedRef = useRef(false);

  // Auto-submit on timer expiry
  useEffect(() => {
    if (timeLeft <= 0 && !submittedRef.current) {
      submittedRef.current = true;
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // Tick down every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const current = questions[currentIdx];
  const answer = answers[current.id];
  const mm = Math.floor(timeLeft / 60);
  const ss = String(timeLeft % 60).padStart(2, "0");
  const allAnswered = questions.every((q) => {
    const a = answers[q.id];
    if (q.type === "mcq") return !!a?.answer_option_id;
    if (q.type === "short") return !!a?.answer_text?.trim();
    return false;
  });

  function setOption(qid: string, optionId: string) {
    setAnswers((prev) => ({
      ...prev,
      [qid]: { question_id: qid, answer_option_id: optionId },
    }));
  }

  function setShortAnswer(qid: string, text: string) {
    setAnswers((prev) => ({
      ...prev,
      [qid]: { question_id: qid, answer_text: text },
    }));
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);

    const payload = {
      exam_id: examId,
      answers: Object.values(answers),
    };

    try {
      const res = await fetch("/api/exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(`Submit failed: ${data.error ?? "Unknown error"}`);
        setSubmitting(false);
        return;
      }

      window.location.href = `/student/exam/${examId}/results`;
    } catch (e) {
      alert("Network error — your answers may not have been saved.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar: timer + subject */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-500">Simulated exam</div>
            <div className="font-semibold text-gray-900">{subjectName}</div>
          </div>
          <div
            className={`flex items-center gap-2 font-mono text-lg font-bold ${
              timeLeft < 60 ? "text-red-600" : "text-gray-900"
            }`}
          >
            <Clock className="w-5 h-5" />
            {mm}:{ss}
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>
              Question {currentIdx + 1} of {questions.length}
            </span>
            <span>
              {Object.keys(answers).length} answered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-brand-700 h-1.5 rounded-full transition-all"
              style={{
                width: `${((currentIdx + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="text-sm text-gray-600">
              Question {currentIdx + 1}
            </div>
            <div className="text-sm font-bold text-brand-700 flex-shrink-0">
              {current.points} pt{current.points !== 1 ? "s" : ""}
            </div>
          </div>

          <p className="text-lg text-gray-900 mb-6">{current.content}</p>

          {current.type === "mcq" && (
            <div className="space-y-2">
              {current.options.map((o) => (
                <label
                  key={o.id}
                  className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition ${
                    answer?.answer_option_id === o.id
                      ? "border-brand-500 bg-brand-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${current.id}`}
                    checked={answer?.answer_option_id === o.id}
                    onChange={() => setOption(current.id, o.id)}
                    className="mt-1 w-4 h-4 text-brand-700 focus:ring-brand-500"
                  />
                  <span className="text-gray-900">{o.text}</span>
                </label>
              ))}
            </div>
          )}

          {current.type === "short" && (
            <div>
              <textarea
                rows={5}
                value={answer?.answer_text ?? ""}
                onChange={(e) => setShortAnswer(current.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Type your answer..."
              />
            </div>
          )}
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
            className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentIdx === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-1 px-5 py-2 bg-brand-700 text-white rounded-lg text-sm font-semibold hover:bg-brand-800 transition disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {submitting ? "Submitting..." : "Submit exam"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
              className="flex items-center gap-1 px-4 py-2 bg-brand-700 text-white rounded-lg text-sm font-semibold hover:bg-brand-800 transition"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Question jumper */}
        <div className="mt-6">
          <p className="text-xs text-gray-500 mb-2">Jump to question:</p>
          <div className="flex flex-wrap gap-1">
            {questions.map((q, i) => {
              const a = answers[q.id];
              const answered =
                (q.type === "mcq" && a?.answer_option_id) ||
                (q.type === "short" && a?.answer_text?.trim());
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(i)}
                  className={`w-8 h-8 rounded text-xs font-medium ${
                    i === currentIdx
                      ? "bg-brand-700 text-white"
                      : answered
                      ? "bg-brand-100 text-brand-800 border border-brand-200"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        {!allAnswered && currentIdx === questions.length - 1 && (
          <p className="text-xs text-amber-700 mt-4 text-center">
            You have unanswered questions. The submit button is enabled
            anyway — you can leave them blank.
          </p>
        )}
      </main>
    </div>
  );
}
