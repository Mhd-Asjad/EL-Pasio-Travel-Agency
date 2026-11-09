import Link from 'next/link';
import { Tag, MapPin, Package, ArrowRight, Plus, Pencil } from 'lucide-react';
import { getCategories, getDestinations, getPackages } from '@/lib/db';

export const instant = false;

export default async function AdminDashboard() {
  const [categories, destinations, packages] = await Promise.all([
    getCategories(),
    getDestinations(),
    getPackages(),
  ]);
  const recentDestinations = [...destinations]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-cream tracking-tight">Dashboard</h1>
        <p className="mt-1 text-cream/50 text-sm">Welcome back. Here&apos;s an overview of your content.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <div className="bg-navy-900 rounded-xl border border-cream/10 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-cream/50 text-xs font-medium uppercase tracking-widest">Categories</p>
              <Tag className="size-4 text-gold-400/80" />
            </div>
            <p className="mt-3 text-4xl font-semibold text-cream">{categories.length}</p>
          </div>
          <Link
            href="/admin/categories"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 transition-colors"
          >
            <span>Manage categories</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="bg-navy-900 rounded-xl border border-cream/10 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-cream/50 text-xs font-medium uppercase tracking-widest">Destinations</p>
              <MapPin className="size-4 text-gold-400/80" />
            </div>
            <p className="mt-3 text-4xl font-semibold text-cream">{destinations.length}</p>
          </div>
          <Link
            href="/admin/destinations"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 transition-colors"
          >
            <span>Manage destinations</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="bg-navy-900 rounded-xl border border-cream/10 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-cream/50 text-xs font-medium uppercase tracking-widest">Packages</p>
              <Package className="size-4 text-gold-400/80" />
            </div>
            <p className="mt-3 text-4xl font-semibold text-cream">{packages.length}</p>
          </div>
          <Link
            href="/admin/packages"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 transition-colors"
          >
            <span>Manage packages</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      {/* Recent Destinations */}
      <div className="bg-navy-900 rounded-xl border border-cream/10 p-6 mb-8">
        <h2 className="text-sm font-semibold text-cream mb-4">Recent Destinations</h2>
        {recentDestinations.length === 0 ? (
          <p className="text-cream/40 text-sm">No destinations yet.</p>
        ) : (
          <ul className="divide-y divide-cream/5">
            {recentDestinations.map((d) => (
              <li key={d.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-cream font-medium">{d.title}</p>
                  <p className="text-xs text-cream/40 mt-0.5">{d.region}</p>
                </div>
                <Link
                  href={`/admin/destinations/${d.id}/edit`}
                  className="inline-flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 transition-colors"
                >
                  <Pencil className="size-3" />
                  <span>Edit</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/destinations/new"
          className="inline-flex items-center gap-1.5 bg-gold-400 text-navy-950 font-semibold rounded-full px-5 py-2.5 hover:bg-gold-300 transition-colors text-sm"
        >
          <Plus className="size-4" />
          <span>Add Destination</span>
        </Link>
        <Link
          href="/admin/packages/new"
          className="inline-flex items-center gap-1.5 bg-cream/5 text-cream border border-cream/10 font-semibold rounded-full px-5 py-2.5 hover:bg-cream/10 transition-colors text-sm"
        >
          <Plus className="size-4" />
          <span>Add Package</span>
        </Link>
      </div>
    </div>
  );
}
