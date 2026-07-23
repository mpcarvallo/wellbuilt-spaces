import { cookies } from "next/headers";
import { checkPassword, createSessionToken, ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
  let password: unknown;
  try {
    const body = (await req.json()) as { password?: unknown };
    password = body.password;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof password !== "string" || !checkPassword(password)) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return Response.json({ ok: true });
}
