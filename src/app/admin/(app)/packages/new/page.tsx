import { getDestinations } from '@/lib/db';
import { PackageForm } from '@/components/admin/package-form';

export const instant = false;

export default async function NewPackagePage() {
  const destinations = await getDestinations();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-cream tracking-tight">New Package</h1>
      </div>
      <PackageForm destinations={destinations} />
    </div>
  );
}
