"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

type Subject = { id: string; name: string; code: string };

const GRADES = ["Form 3", "Form 4", "Form 5"];

export function NewQuestionForm({
  schoolId,
  subjects,
}: {
  schoolId: string;
  subjects: Subject[];
}) {
  const router = useRouter();
  const [type, setType] = useState<"mcq" | "short">("mcq");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [grade, setGrade] = useState("Form 4");
  const [content, setContent] = useState("");
  const [topicLabel, setTopicLabel] = useState("");
  const [difficulty, setDifficulty] = useState(2);
  const [points, setPoints] = useState(1);
  const [markScheme, setMarkScheme] = useState("");
  const [options, setOptions] = useState([
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateOption(idx: number, field: "text" | "is_correct", value: string | boolean) {
    const next = [...options];
    if (field === "is_correct") {
      // Only one correct answer for MCQ
      next.forEach((o, i) => (o.is_correct = i === idx));
      setOptions(next);
    } else {
      next[idx] = { ...next[idx], text: value as string };
      setOptions(next);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!content.trim()) {
      setError("Question content is required");
      setLoading(false);
      return;
    }

    if (type === "short" && !markScheme.trim()) {
      setError("Mark scheme is required for short-answer questions");
      setLoading(false);
      return;
    }

    if (type === "mcq") {
      const filledOptions = options.filter((o) => o.text.trim());
      const correctCount = filledOptions.filter((o) => o.is_correct).length;
      if (filledOptions.length < 2) {
        setError("MCQ questions need at least 2 options");
        setLoading(false);
        return;
      }
      if (correctCount !== 1) {
        setError("Mark exactly one option as correct");
        setLoading(false);
        return;
      }
    }

    const supabase = createClient();

    // 1. Create the question
    const { data: question, error: qError } = await supabase
      .from("questions")
      .insert({
        school_id: schoolId,
        type,
        subject_id: subjectId,
        grade,
        content: content.trim(),
        topic_label: topicLabel.trim() || null,
        difficulty,
        points,
        mark_scheme: type === "short" ? markScheme.trim() : null,
        status: "pending",
      })
      .select("id")
      .single();

    if (qError || !question) {
      setError(qError?.message ?? "Failed to create question");
      setLoading(false);
      return;
    }

    // 2. If MCQ, insert options
    if (type === "mcq") {
      const rows = options
        .filter((o) => o.text.trim())
        .map((o, i) => ({
          question_id: question.id,
          text: o.text.trim(),
          is_correct: o.is_correct,
          order: i,
        }));

      const { error: oError } = await supabase
        .from("question_options")
        .insert(rows);

      if (oError) {
        setError(`Question saved, but options failed: ${oError.message}`);
        setLoading(false);
        return;
      }
    }

    // Success — go to my questions list
    router.push("/teacher/questions");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Question type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question type
        </label>
        <div className="flex gap-2">
          {(["mcq", "short"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                type === t
                  ? "bg-brand-700 text-white border-brand-700"
                  : "bg-white text-gray-700 border-gray-300 hover:border-brand-300"
              }`}
            >
              {t === "mcq" ? "Multiple choice" : "Short answer"}
            </button>
          ))}
        </div>
      </div>

      {/* Subject + grade */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subject
          </label>
          <select
            id="subject"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="grade"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Grade
          </label>
          <select
            id="grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          >
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Question
        </label>
        <textarea
          id="content"
          required
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="Paste the question text here..."
        />
      </div>

      {/* Topic */}
      <div>
        <label
          htmlFor="topic"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Topic <span className="text-gray-400 text-xs">(optional, free text for now)</span>
        </label>
        <input
          id="topic"
          type="text"
          value={topicLabel}
          onChange={(e) => setTopicLabel(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="e.g. Algebra, Cell Biology, The Cold War"
        />
      </div>

      {/* MCQ options */}
      {type === "mcq" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Answer options (tick the correct one)
          </label>
          <div className="space-y-2">
            {options.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  checked={o.is_correct}
                  onChange={() => updateOption(i, "is_correct", true)}
                  className="w-4 h-4 text-brand-700 focus:ring-brand-500"
                />
                <input
                  type="text"
                  value={o.text}
                  onChange={(e) => updateOption(i, "text", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder={`Option ${i + 1}`}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Leave options blank if you have fewer than 4 choices.
          </p>
        </div>
      )}

      {/* Short answer mark scheme */}
      {type === "short" && (
        <div>
          <label
            htmlFor="markScheme"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mark scheme / model answer
          </label>
          <textarea
            id="markScheme"
            required
            rows={3}
            value={markScheme}
            onChange={(e) => setMarkScheme(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="The ideal answer the AI will compare against..."
          />
        </div>
      )}

      {/* Difficulty + points */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="difficulty"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Difficulty
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value={1}>Easy</option>
            <option value={2}>Medium</option>
            <option value={3}>Hard</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="points"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Points
          </label>
          <input
            id="points"
            type="number"
            min={1}
            max={20}
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-700 text-white py-2.5 rounded-lg font-semibold hover:bg-brand-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Submitting..." : "Submit for review"}
      </button>
    </form>
  );
}
