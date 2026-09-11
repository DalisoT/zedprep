import OpenAI from "openai";

// Provider configuration.
// Order: MiniMax (preferred, since you have the key) → OpenAI → none.
//
// To switch providers, set the relevant env var. You can also override the
// model name with EMBEDDING_MODEL.

type Provider = "minimax" | "openai" | null;

function getProvider(): Provider {
  if (process.env.MINIMAX_API_KEY) return "minimax";
  if (process.env.OPENAI_API_KEY) return "openai";
  return null;
}

function getClient(): OpenAI | null {
  const provider = getProvider();
  if (!provider) return null;

  if (provider === "minimax") {
    // MiniMax exposes an OpenAI-compatible API at api.minimax.chat
    return new OpenAI({
      apiKey: process.env.MINIMAX_API_KEY!,
      baseURL:
        process.env.MINIMAX_BASE_URL ?? "https://api.minimax.chat/v1",
    });
  }

  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
}

function getModel(): string {
  // Allow override via env var. Defaults per provider.
  if (process.env.EMBEDDING_MODEL) return process.env.EMBEDDING_MODEL;

  const provider = getProvider();
  if (provider === "minimax") return "embo-01"; // MiniMax's embedding model (1024 dims)
  return "text-embedding-3-small"; // OpenAI default (1536 dims)
}

let client: OpenAI | null = null;
let cachedProvider: Provider | null = null;

function getOrCreateClient(): OpenAI | null {
  const provider = getProvider();
  if (!provider) return null;
  // Recreate the client if the provider changed (e.g. env vars updated)
  if (cachedProvider !== provider) {
    client = null;
    cachedProvider = provider;
  }
  if (!client) {
    client = getClient();
  }
  return client;
}

export async function embedText(text: string): Promise<number[] | null> {
  const c = getOrCreateClient();
  if (!c) return null;

  try {
    const response = await c.embeddings.create({
      model: getModel(),
      input: text.slice(0, 8000), // safety cap
    });
    return response.data[0]?.embedding ?? null;
  } catch (err) {
    // Log to server console but don't crash the request
    console.error("[embeddings] failed:", err);
    return null;
  }
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
