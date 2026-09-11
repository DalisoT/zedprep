import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  embedText,
  cosineSimilarity,
  similarityToScore,
  embeddingToPgVector,
} from "@/lib/embeddings";

type Body = {
  question_id: string;
  answer_text?: string;
  answer_option_id?: string;
  time_taken_sec?: number;
};

export async function POST(request: Request) {
  const supabase = createClient();

  // 1. Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 2. Parse body
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.question_id) {
    return NextResponse.json(
      { error: "question_id is required" },
      { status: 400 }
    );
  }

  if (!body.answer_text && !body.answer_option_id) {
    return NextResponse.json(
      { error: "Provide answer_text or answer_option_id" },
      { status: 400 }
    );
  }

  // 3. Load the question + verify the student belongs to the same school
  const { data: question, error: qError } = await supabase
    .from("questions")
    .select(
      "id, type, content, mark_scheme, points, school_id, status, question_options(id, text, is_correct, option_order)"
    )
    .eq("id", body.question_id)
    .maybeSingle();

  if (qError || !question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }
  if (question.status !== "approved") {
    return NextResponse.json(
      { error: "Question is not approved" },
      { status: 403 }
    );
  }

  const { data: studentProfile } = await supabase
    .from("users")
    .select("school_id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (
    !studentProfile ||
    studentProfile.school_id !== question.school_id ||
    studentProfile.role !== "student"
  ) {
    return NextResponse.json(
      { error: "Not authorised for this question" },
      { status: 403 }
    );
  }

  // 4. Grade
  let is_correct: boolean;
  let score: number;
  let similarity: number | null = null;
  let ai_feedback: string;

  if (question.type === "mcq") {
    // MCQ grading — exact match on selected option
    const options = Array.isArray(question.question_options)
      ? question.question_options
      : [];

    const selected = options.find((o) => o.id === body.answer_option_id);
    if (!selected) {
      return NextResponse.json(
        { error: "Selected option not found" },
        { status: 400 }
      );
    }

    is_correct = selected.is_correct === true;
    score = is_correct ? question.points * 100 : 0;
    similarity = is_correct ? 1 : 0;
    ai_feedback = is_correct
      ? `Correct. ${question.points} point${question.points !== 1 ? "s" : ""} earned.`
      : `Incorrect. The correct answer is option ${options.findIndex((o) => o.is_correct) + 1}.`;
  } else {
    // Short-answer grading via OpenAI embeddings
    if (!body.answer_text || !body.answer_text.trim()) {
      return NextResponse.json(
        { error: "answer_text is required for short-answer questions" },
        { status: 400 }
      );
    }

    if (!question.mark_scheme) {
      return NextResponse.json(
        { error: "Question has no mark scheme — cannot grade" },
        { status: 500 }
      );
    }

    const [studentEmbedding, markSchemeEmbedding] = await Promise.all([
      embedText(body.answer_text),
      embedText(question.mark_scheme),
    ]);

    if (!studentEmbedding || !markSchemeEmbedding) {
      // No OpenAI key — fall back to manual review mode
      is_correct = false;
      score = 0;
      similarity = null;
      ai_feedback =
        "Auto-grading is temporarily unavailable. Your teacher will review your answer.";
    } else {
      similarity = cosineSimilarity(studentEmbedding, markSchemeEmbedding);
      score = (similarityToScore(similarity) / 100) * question.points * 100;
      is_correct = similarity >= 0.7;
      ai_feedback =
        similarity >= 0.85
          ? `Excellent — matches the mark scheme closely (${Math.round(similarity * 100)}% similarity).`
          : similarity >= 0.7
          ? `Good — partially matches the mark scheme (${Math.round(similarity * 100)}% similarity).`
          : similarity >= 0.4
          ? `Partially correct — your answer covers some key points but is missing others (${Math.round(similarity * 100)}% similarity).`
          : `Incorrect — your answer does not match the mark scheme closely enough (${Math.round(similarity * 100)}% similarity).`;
    }
  }

  // 5. Save the attempt
  const { error: insertError } = await supabase.from("attempts").insert({
    user_id: user.id,
    question_id: question.id,
    school_id: question.school_id,
    mode: "practice",
    answer_text: body.answer_text ?? null,
    answer_option_id: body.answer_option_id ?? null,
    is_correct,
    score,
    similarity,
    ai_feedback,
    time_taken_sec: body.time_taken_sec ?? null,
  });

  if (insertError) {
    return NextResponse.json(
      { error: `Graded but failed to save: ${insertError.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({
    is_correct,
    score,
    similarity,
    ai_feedback,
    points: question.points,
  });
}

// Optional: precompute the mark scheme embedding for a question.
// Called by an admin action or via a separate cron. Not wired to UI yet.
export async function PUT(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.question_id) {
    return NextResponse.json(
      { error: "question_id is required" },
      { status: 400 }
    );
  }

  // Verify the caller is a school_admin
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "school_admin") {
    return NextResponse.json(
      { error: "Only school admins can trigger embedding" },
      { status: 403 }
    );
  }

  const { data: question } = await supabase
    .from("questions")
    .select("mark_scheme")
    .eq("id", body.question_id)
    .maybeSingle();

  if (!question?.mark_scheme) {
    return NextResponse.json(
      { error: "Question has no mark scheme" },
      { status: 400 }
    );
  }

  const embedding = await embedText(question.mark_scheme);
  if (!embedding) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not set or embedding failed" },
      { status: 500 }
    );
  }

  const { error } = await supabase
    .from("questions")
    .update({
      mark_scheme_embedding: embeddingToPgVector(embedding),
      embedding_model: "text-embedding-3-small",
    })
    .eq("id", body.question_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
