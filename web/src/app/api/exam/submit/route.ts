import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  embedText,
  cosineSimilarity,
  similarityToScore,
} from "@/lib/embeddings";

type Answer = {
  question_id: string;
  answer_text?: string;
  answer_option_id?: string;
};

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: { exam_id: string; answers: Answer[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.exam_id || !body.answers) {
    return NextResponse.json(
      { error: "exam_id and answers are required" },
      { status: 400 }
    );
  }

  // 1. Fetch the exam (must belong to the user, must be in_progress)
  const { data: exam } = await supabase
    .from("simulated_exams")
    .select("id, user_id, school_id, status, started_at, question_count")
    .eq("id", body.exam_id)
    .maybeSingle();

  if (!exam || exam.user_id !== user.id) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }
  if (exam.status !== "in_progress") {
    return NextResponse.json(
      { error: "Exam already completed" },
      { status: 400 }
    );
  }

  // 2. Fetch the questions (with their mark schemes + options) for this exam
  const { data: questions } = await supabase
    .from("simulated_exam_questions")
    .select(
      "order_index, questions(id, type, content, mark_scheme, points, question_options(id, text, is_correct, option_order))"
    )
    .eq("exam_id", body.exam_id)
    .order("order_index", { ascending: true });

  if (!questions || questions.length === 0) {
    return NextResponse.json(
      { error: "No questions in this exam" },
      { status: 500 }
    );
  }

  // 3. Index the user's answers by question_id
  const answersByQid = new Map<string, Answer>();
  for (const a of body.answers) {
    answersByQid.set(a.question_id, a);
  }

  // 4. Grade each question, insert into attempts
  let totalScore = 0;
  let totalPoints = 0;
  const attemptRows: Array<{
    user_id: string;
    question_id: string;
    school_id: string;
    mode: string;
    exam_id: string;
    answer_text: string | null;
    answer_option_id: string | null;
    is_correct: boolean;
    score: number;
    similarity: number | null;
    ai_feedback: string;
  }> = [];

  for (const eq of questions) {
    const q = Array.isArray(eq.questions) ? eq.questions[0] : eq.questions;
    if (!q) continue;
    const ans = answersByQid.get(q.id);
    totalPoints += q.points;

    let is_correct = false;
    let score = 0;
    let similarity: number | null = null;
    let ai_feedback = "";

    if (q.type === "mcq") {
      const options = Array.isArray(q.question_options)
        ? q.question_options
        : [];
      const selected = options.find((o) => o.id === ans?.answer_option_id);
      is_correct = selected?.is_correct === true;
      score = is_correct ? q.points * 100 : 0;
      similarity = is_correct ? 1 : 0;
      ai_feedback = is_correct ? "Correct." : "Incorrect.";
    } else if (q.type === "short") {
      if (ans?.answer_text && q.mark_scheme) {
        const [studentEmb, markEmb] = await Promise.all([
          embedText(ans.answer_text),
          embedText(q.mark_scheme),
        ]);
        if (studentEmb && markEmb) {
          similarity = cosineSimilarity(studentEmb, markEmb);
          score = (similarityToScore(similarity) / 100) * q.points * 100;
          is_correct = similarity >= 0.7;
          ai_feedback = similarity >= 0.7 ? "Acceptable." : "Not enough overlap.";
        } else {
          ai_feedback = "Auto-grading unavailable for this answer.";
        }
      }
    }

    totalScore += score;
    attemptRows.push({
      user_id: user.id,
      question_id: q.id,
      school_id: exam.school_id,
      mode: "simulated_exam",
      exam_id: body.exam_id,
      answer_text: ans?.answer_text ?? null,
      answer_option_id: ans?.answer_option_id ?? null,
      is_correct,
      score,
      similarity,
      ai_feedback,
    });
  }

  // 5. Insert all attempts
  if (attemptRows.length > 0) {
    const { error: attemptsError } = await supabase
      .from("attempts")
      .insert(attemptRows);

    if (attemptsError) {
      return NextResponse.json(
        { error: `Grading ran but save failed: ${attemptsError.message}` },
        { status: 500 }
      );
    }
  }

  // 6. Mark exam as completed
  const now = new Date();
  const startedAt = new Date(exam.started_at);
  const timeTaken = Math.round((now.getTime() - startedAt.getTime()) / 1000);

  const { error: updateError } = await supabase
    .from("simulated_exams")
    .update({
      status: "completed",
      completed_at: now.toISOString(),
      total_score: totalScore,
      time_taken_sec: timeTaken,
    })
    .eq("id", body.exam_id);

  if (updateError) {
    return NextResponse.json(
      { error: `Exam graded but status update failed: ${updateError.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({
    exam_id: body.exam_id,
    total_score: totalScore,
    total_points: totalPoints * 100,
    percentage: totalPoints > 0 ? Math.round((totalScore / (totalPoints * 100)) * 100) : 0,
    time_taken_sec: timeTaken,
  });
}
