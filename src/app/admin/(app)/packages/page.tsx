import Link from 'next/link';
import Image from 'next/image';
import { Plus, MapPin, Image as ImageIcon, Pencil, ArrowRight } from 'lucide-react';
import { getPackages, getDestinations } from '@/lib/db';
import { deletePackage } from '@/lib/admin-actions';
import { DeleteButton } from '@/components/admin/delete-button';
import { FeaturedToggle } from '@/components/admin/featured-toggle';

export const instant = false;

export default async function PackagesPage() {
  const [packages, destinations] = await Promise.all([getPackages(), getDestinations()]);

  function destTitle(id: string) {
    return destinations.find((d) => d.id === id)?.title ?? id;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-cream tracking-tight">Packages</h1>
          <p className="mt-1 text-cream/50 text-sm">{packages.length} package{packages.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/packages/new"
          className="inline-flex items-center gap-1.5 bg-gold-400 text-navy-950 font-semibold rounded-full px-5 py-2.5 hover:bg-gold-300 transition-colors text-sm"
        >
          <Plus className="size-4" />
          <span>Add Package</span>
        </Link>
      </div>

      {packages.length === 0 ? (
        <div className="bg-navy-900 rounded-xl border border-cream/10 p-12 text-center">
          <p className="text-cream/40 text-sm">No packages yet.</p>
          <Link href="/admin/packages/new" className="mt-4 inline-flex items-center gap-1.5 text-gold-400 text-sm hover:text-gold-300">
            <span>Add your first package</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      ) : (
        <div className="bg-navy-900 rounded-xl border border-cream/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream/10">
                <th className="text-left text-cream/40 font-medium px-6 py-3 text-xs uppercase tracking-widest">Brochure</th>
                <th className="text-left text-cream/40 font-medium px-4 py-3 text-xs uppercase tracking-widest">Package</th>
                <th className="text-left text-cream/40 font-medium px-4 py-3 text-xs uppercase tracking-widest hidden md:table-cell">Destination</th>
                <th className="text-left text-cream/40 font-medium px-4 py-3 text-xs uppercase tracking-widest hidden lg:table-cell">Highlights</th>
                <th className="text-right text-cream/40 font-medium px-6 py-3 text-xs uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream/5">
              {packages.map((pkg) => {
                const deleteAction = deletePackage.bind(null, pkg.id);
                const imageCount = pkg.images?.length || (pkg.src ? 1 : 0);
                return (
                  <tr key={pkg.id} className="hover:bg-cream/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="relative size-[64px] rounded-xl overflow-hidden bg-navy-950 border border-cream/10">
                        {pkg.src ? (
                          <Image
                            src={pkg.src}
                            alt={pkg.alt || pkg.label}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="size-full flex items-center justify-center text-xs text-cream/30">
                            <ImageIcon className="size-5" />
                          </div>
                        )}
                        {imageCount > 1 && (
                          <span className="absolute bottom-1 right-1 bg-navy-950/90 text-gold-400 font-mono text-[9px] px-1 py-0.5 rounded font-semibold">
                            +{imageCount - 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-cream text-base">
                          {pkg.label || `${pkg.lead} ${pkg.accent}`}
                        </p>
                      </div>
                      <p className="text-cream/40 text-xs mt-0.5">
                        {imageCount} brochure image{imageCount !== 1 ? 's' : ''}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-cream/70 hidden md:table-cell">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-cream/5 border border-cream/10 px-2.5 py-1 text-xs">
                        <MapPin className="size-3 text-gold-400 shrink-0" />
                        <span>{destTitle(pkg.destinationId)}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="max-w-[240px]">
                        {pkg.highlights && pkg.highlights.length > 0 ? (
                          <p className="text-xs text-cream/60 truncate">
                            {pkg.highlights.join(' • ')}
                          </p>
                        ) : (
                          <span className="text-xs text-cream/30 italic">No highlights</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2.5">
                        <FeaturedToggle
                          packageId={pkg.id}
                          initialFeatured={pkg.featured !== false}
                          label={pkg.label || `${pkg.lead} ${pkg.accent}`}
                        />
                        <Link
                          href={`/admin/packages/${pkg.id}/edit`}
                          className="inline-flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 border border-gold-400/30 rounded-full px-3 py-1.5 transition-colors font-medium"
                        >
                          <Pencil className="size-3" />
                          <span>Edit</span>
                        </Link>
                        <DeleteButton
                          action={deleteAction}
                          itemName={pkg.label || `${pkg.lead} ${pkg.accent}`}
                          itemType="package"
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
