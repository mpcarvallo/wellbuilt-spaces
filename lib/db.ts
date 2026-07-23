import { neon } from "@neondatabase/serverless";
import type { Answers } from "@/types/questionnaire";
import type { SubmissionRecord } from "@/types/submission";

const CONNECTION_STRING = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

export function isDbConfigured(): boolean {
  return CONNECTION_STRING !== "";
}

function client() {
  return neon(CONNECTION_STRING);
}

let schemaReady: Promise<void> | null = null;

/** Creates the submissions table on first use. Idempotent, cheap enough at this scale. */
function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    const sql = client();
    schemaReady = sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        answers JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `.then(() => undefined);
  }
  return schemaReady;
}

export async function insertSubmission(id: string, email: string, answers: Answers): Promise<void> {
  const sql = client();
  await ensureSchema();
  await sql`
    INSERT INTO submissions (id, email, answers)
    VALUES (${id}, ${email}, ${JSON.stringify(answers)}::jsonb)
  `;
}

export async function listSubmissions(): Promise<SubmissionRecord[]> {
  const sql = client();
  await ensureSchema();
  const rows = (await sql`
    SELECT id, email, answers, created_at
    FROM submissions
    ORDER BY created_at DESC
  `) as { id: string; email: string; answers: Answers; created_at: string }[];
  return rows.map((r) => ({ id: r.id, email: r.email, answers: r.answers, createdAt: r.created_at }));
}
