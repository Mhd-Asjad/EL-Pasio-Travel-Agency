import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  ADMIN_TOKEN_MAX_AGE,
  type AdminToken,
  verifyAdminToken,
} from "./auth-token";

export async function getAdminSession(): Promise<AdminToken | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function requireAdmin(): Promise<AdminToken> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function setAdminCookie(token: string) {
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_TOKEN_MAX_AGE,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}
