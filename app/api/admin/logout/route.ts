import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(): Promise<Response> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  return Response.json({ ok: true });
}
