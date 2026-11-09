import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth";

export const instant = false;

export default async function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-navy-900">
      <aside className="flex w-64 shrink-0 flex-col border-r border-cream/10 bg-navy-950">
        <div className="border-b border-cream/10 px-6 py-6">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
            EL PASEO
          </span>
          <p className="mt-1 text-xs uppercase tracking-widest text-cream/40">
            Admin Panel
          </p>
        </div>
        <AdminNav />
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
