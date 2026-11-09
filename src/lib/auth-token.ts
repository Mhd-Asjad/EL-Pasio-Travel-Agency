import { jwtVerify, SignJWT } from "jose";

export const ADMIN_COOKIE = "elpaseo_admin_token";
export const ADMIN_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export type AdminToken = {
  sub: string;
  email: string;
  role: "admin";
};

function secretKey() {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret || secret.length < 16) {
    throw new Error(
      "JWT_SECRET is missing or too short. Add a 32+ character secret to .env.local.",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signAdminToken(admin: { id: string; email: string }) {
  return new SignJWT({ email: admin.email, role: "admin" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(admin.id)
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_TOKEN_MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifyAdminToken(token: string): Promise<AdminToken | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });
    const email = typeof payload.email === "string" ? payload.email : "";
    const sub = typeof payload.sub === "string" ? payload.sub : "";
    if (!email || !sub || payload.role !== "admin") return null;
    return { sub, email, role: "admin" };
  } catch {
    return null;
  }
}
