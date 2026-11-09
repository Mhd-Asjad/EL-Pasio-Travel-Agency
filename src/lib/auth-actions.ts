"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { countAdmins, createAdmin, getAdminByEmail } from "./db";
import { clearAdminCookie, setAdminCookie } from "./auth";
import { signAdminToken } from "./auth-token";

export type AuthResult = { success: boolean; error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanEmail(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().toLowerCase();
}

function cleanPassword(value: FormDataEntryValue | null) {
  return String(value ?? "");
}

function nextPath(value: FormDataEntryValue | null) {
  const raw = String(value ?? "/admin");
  return raw.startsWith("/admin") && !raw.startsWith("/admin/login") ? raw : "/admin";
}

export async function hasAdminAccount() {
  return (await countAdmins()) > 0;
}

export async function createFirstAdmin(
  _prev: AuthResult | null,
  formData: FormData,
): Promise<AuthResult> {
  try {
    if ((await countAdmins()) > 0) {
      return { success: false, error: "An admin account already exists. Sign in instead." };
    }

    const email = cleanEmail(formData.get("email"));
    const password = cleanPassword(formData.get("password"));
    const confirm = cleanPassword(formData.get("confirm"));

    if (!EMAIL_RE.test(email)) {
      return { success: false, error: "Enter a valid email address." };
    }
    if (password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters." };
    }
    if (password !== confirm) {
      return { success: false, error: "Passwords do not match." };
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await createAdmin(email, passwordHash);
    const token = await signAdminToken(admin);
    await setAdminCookie(token);
  } catch (err) {
    return { success: false, error: String(err) };
  }

  redirect(nextPath(formData.get("next")));
}

export async function loginAdmin(
  _prev: AuthResult | null,
  formData: FormData,
): Promise<AuthResult> {
  try {
    const email = cleanEmail(formData.get("email"));
    const password = cleanPassword(formData.get("password"));

    if (!EMAIL_RE.test(email) || password.length < 1) {
      return { success: false, error: "Enter your email and password." };
    }

    const admin = await getAdminByEmail(email);
    const ok = admin ? await bcrypt.compare(password, admin.passwordHash) : false;
    if (!admin || !ok) {
      return { success: false, error: "Invalid email or password." };
    }

    const token = await signAdminToken(admin);
    await setAdminCookie(token);
  } catch (err) {
    return { success: false, error: String(err) };
  }

  redirect(nextPath(formData.get("next")));
}

export async function logoutAdmin() {
  await clearAdminCookie();
  redirect("/admin/login");
}
