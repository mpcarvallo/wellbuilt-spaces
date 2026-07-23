import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { isDbConfigured, listSubmissions } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifySessionToken(session)) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  if (!isDbConfigured()) {
    return Response.json({ error: "No database configured yet." }, { status: 503 });
  }

  try {
    const submissions = await listSubmissions();
    return Response.json({ submissions });
  } catch {
    return Response.json({ error: "Could not load submissions." }, { status: 502 });
  }
}
