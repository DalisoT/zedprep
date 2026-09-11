import OpenAI from "openai";

const EMBEDDING_MODEL = "text-embedding-3-small"; // 1536 dims, ~$0.02 per 1M tokens

let client: OpenAI | null = null;

function getClient(): OpenAI | null {
  if (client) return client;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  client = new OpenAI({ apiKey });
  return client;
}

export async function embedText(text: string): Promise<number[] | null> {
  const c = getClient();
  if (!c) return null;

  const response = await c.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text.slice(0, 8000), // safety cap
  });

  return response.data[0]?.embedding ?? null;
}

// Cosine similarity between two unit vectors.
// Returns a value in [-1, 1]; typically [0, 1] for natural-language text.
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(`Vector length mismatch: ${a.length} vs ${b.length}`);
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom === 0) return 0;
  return dot / denom;
}

// Map a similarity in [-1, 1] to a 0-100 score using thresholds from
// BUILD_PLAN §10. Tunable later based on real grading accuracy.
export function similarityToScore(similarity: number): number {
  const s = Math.max(0, Math.min(1, similarity));
  if (s >= 0.85) return 100;
  if (s >= 0.7) return 75;
  if (s >= 0.55) return 50;
  if (s >= 0.4) return 25;
  return 0;
}

// Format embedding array for pgvector storage: '[1.1,2.2,3.3]'
export function embeddingToPgVector(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}
