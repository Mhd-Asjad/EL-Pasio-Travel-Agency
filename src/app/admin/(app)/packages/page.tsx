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
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-cream sm:text-2xl">Packages</h1>
          <p className="mt-1 text-sm text-cream/50">{packages.length} package{packages.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/packages/new"
          className="inline-flex min-h-11 items-center justify-center gap-1.5 self-start rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-300"
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
        <div className="-mx-4 overflow-x-auto overscroll-x-contain sm:mx-0 sm:rounded-xl sm:border sm:border-cream/10 sm:bg-navy-900">
          <table className="w-full min-w-[36rem] text-sm sm:min-w-0">
            <thead>
              <tr className="border-b border-cream/10">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-cream/40 sm:px-6">Brochure</th>
                <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-widest text-cream/40 sm:px-4">Package</th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-cream/40 md:table-cell">Destination</th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-cream/40 lg:table-cell">Highlights</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-widest text-cream/40 sm:px-6">Actions</th>
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
