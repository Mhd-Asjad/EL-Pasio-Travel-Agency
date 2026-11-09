"use client";

import { useActionState } from "react";
import { createFirstAdmin, loginAdmin, type AuthResult } from "@/lib/auth-actions";
import { Button } from "../ui";

const field =
  "mt-2 w-full rounded-full border border-cream/20 bg-navy-950/60 px-5 py-3 text-sm text-cream outline-none transition-colors placeholder:text-cream/35 focus:border-gold-400";

export function LoginForm({
  mode,
  nextPath,
}: {
  mode: "create" | "login";
  nextPath: string;
}) {
  const action = mode === "create" ? createFirstAdmin : loginAdmin;
  const [state, formAction, pending] = useActionState<AuthResult | null, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input type="hidden" name="next" value={nextPath} />

      <label className="block">
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-cream/55">
          Email
        </span>
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          placeholder="you@elpaseo.com"
          className={field}
        />
      </label>

      <label className="block">
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-cream/55">
          Password
        </span>
        <input
          type="password"
          name="password"
          required
          minLength={mode === "create" ? 8 : 1}
          autoComplete={mode === "create" ? "new-password" : "current-password"}
          placeholder={mode === "create" ? "At least 8 characters" : "Your password"}
          className={field}
        />
      </label>

      {mode === "create" ? (
        <label className="block">
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-cream/55">
            Confirm password
          </span>
          <input
            type="password"
            name="confirm"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Repeat password"
            className={field}
          />
        </label>
      ) : null}

      {state?.error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending
          ? "Please wait…"
          : mode === "create"
            ? "Create admin access"
            : "Sign in"}
      </Button>
    </form>
  );
}
