import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, ArrowRight, Tag } from 'lucide-react';
import { getDestinations, getPackages } from '@/lib/db';
import { deleteDestination } from '@/lib/admin-actions';
import { DeleteButton } from '@/components/admin/delete-button';

export const instant = false;

export default async function DestinationsPage() {
  const [destinations, packages] = await Promise.all([getDestinations(), getPackages()]);

  function pkgCount(id: string) {
    return packages.filter((p) => p.destinationId === id).length;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-cream tracking-tight">Destinations</h1>
          <p className="mt-1 text-cream/50 text-sm">{destinations.length} destination{destinations.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/destinations/new"
          className="inline-flex items-center gap-1.5 bg-gold-400 text-navy-950 font-semibold rounded-full px-5 py-2.5 hover:bg-gold-300 transition-colors text-sm"
        >
          <Plus className="size-4" />
          <span>Add Destination</span>
        </Link>
      </div>

      {destinations.length === 0 ? (
        <div className="bg-navy-900 rounded-xl border border-cream/10 p-12 text-center">
          <p className="text-cream/40 text-sm">No destinations yet.</p>
          <Link href="/admin/destinations/new" className="mt-4 inline-flex items-center gap-1.5 text-gold-400 text-sm hover:text-gold-300">
            <span>Add your first destination</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      ) : (
        <div className="bg-navy-900 rounded-xl border border-cream/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream/10">
                <th className="text-left text-cream/40 font-medium px-6 py-3 text-xs uppercase tracking-widest">Image</th>
                <th className="text-left text-cream/40 font-medium px-4 py-3 text-xs uppercase tracking-widest">Title</th>
                <th className="text-left text-cream/40 font-medium px-4 py-3 text-xs uppercase tracking-widest hidden sm:table-cell">Region</th>
                <th className="text-left text-cream/40 font-medium px-4 py-3 text-xs uppercase tracking-widest hidden lg:table-cell">Category</th>
                <th className="text-left text-cream/40 font-medium px-4 py-3 text-xs uppercase tracking-widest hidden md:table-cell">Packages</th>
                <th className="text-right text-cream/40 font-medium px-6 py-3 text-xs uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream/5">
              {destinations.map((d) => {
                const deleteAction = deleteDestination.bind(null, d.id);
                return (
                  <tr key={d.id} className="hover:bg-cream/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <Image
                        src={d.src}
                        alt={d.alt}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover w-[60px] h-[60px]"
                        unoptimized
                      />
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-cream">{d.title}</p>
                      <p className="text-cream/40 text-xs mt-0.5 sm:hidden">{d.region}</p>
                    </td>
                    <td className="px-4 py-4 text-cream/60 hidden sm:table-cell">{d.region}</td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      {d.categoryName ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gold-400/10 border border-gold-400/20 px-2.5 py-0.5 text-xs text-gold-300">
                          <Tag className="size-2.5" />
                          <span>{d.categoryName}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-cream/30 italic">Uncategorized</span>
                      )}
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="inline-block bg-cream/5 text-cream/60 rounded-full px-2.5 py-0.5 text-xs">
                        {pkgCount(d.id)} pkg{pkgCount(d.id) !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/destinations/${d.id}/edit`}
                          className="inline-flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 border border-gold-400/30 rounded-full px-3 py-1.5 transition-colors font-medium"
                        >
                          <Pencil className="size-3" />
                          <span>Edit</span>
                        </Link>
                        <DeleteButton
                          action={deleteAction}
                          itemName={d.title}
                          itemType="destination"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
