import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { LogoBadge } from "@/components/brand-mark";
import { getAdminSession } from "@/lib/auth";
import { hasAdminAccount } from "@/lib/auth-actions";
import { accentClass } from "@/components/ui";

export const instant = false;

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  const { next } = await searchParams;
  const nextPath =
    next && next.startsWith("/admin") && !next.startsWith("/admin/login")
      ? next
      : "/admin";
  const exists = await hasAdminAccount();

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-navy-950 px-5 py-16 text-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[18%] h-[36rem] w-[56rem] max-w-none -translate-x-1/2 bg-[radial-gradient(closest-side,oklch(0.35_0.08_258/0.7),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[55%] h-[22rem] w-[32rem] max-w-none -translate-x-1/2 bg-[radial-gradient(closest-side,oklch(0.73_0.125_80/0.12),transparent)]"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-cream/10 bg-navy-900/80 p-8 shadow-[0_28px_70px_-28px_oklch(0.05_0.04_258/0.85)] backdrop-blur-md md:p-10">
        <div className="flex flex-col items-center text-center">
          <LogoBadge className="size-16" sizes="64px" />
          <p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-gold-300">
            EL PASEO
          </p>
          <h1 className="mt-3 text-[clamp(1.8rem,4vw,2.35rem)] font-light tracking-[-0.03em]">
            {exists ? "Admin " : "Create "}
            <span className={accentClass}>{exists ? "access" : "admin"}</span>
          </h1>
          <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-cream/70">
            {exists
              ? "Sign in with your admin email. A signed JWT keeps this session for seven days."
              : "No admin exists yet. Create the first account. We will issue a JWT and open the panel."}
          </p>
        </div>

        <LoginForm mode={exists ? "login" : "create"} nextPath={nextPath} />
      </div>
    </div>
  );
}
