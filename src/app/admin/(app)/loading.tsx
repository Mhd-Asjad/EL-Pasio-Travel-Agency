export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 rounded-lg bg-cream/10" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="h-32 rounded-xl bg-cream/5 border border-cream/10" />
        <div className="h-32 rounded-xl bg-cream/5 border border-cream/10" />
      </div>
      <div className="h-64 rounded-xl bg-cream/5 border border-cream/10" />
    </div>
  );
}
