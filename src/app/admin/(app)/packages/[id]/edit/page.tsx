import { notFound } from 'next/navigation';
import { getPackages, getDestinations } from '@/lib/db';
import { PackageForm } from '@/components/admin/package-form';

export const instant = false;

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPackagePage({ params }: Props) {
  const { id } = await params;
  const [packages, destinations] = await Promise.all([getPackages(), getDestinations()]);
  const pkg = packages.find((p) => p.id === id);

  if (!pkg) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-cream tracking-tight">Edit Package</h1>
      </div>
      <PackageForm package={pkg} destinations={destinations} />
    </div>
  );
}
