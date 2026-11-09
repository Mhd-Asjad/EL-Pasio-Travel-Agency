import { getCategories } from '@/lib/db';
import { DestinationForm } from '@/components/admin/destination-form';

export const instant = false;

export default async function NewDestinationPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-cream tracking-tight">New Destination</h1>
        <p className="mt-1 text-cream/50 text-sm">Add a new destination to the site.</p>
      </div>
      <div className="bg-navy-900 rounded-xl border border-cream/10 p-6">
        <DestinationForm categories={categories} />
      </div>
    </div>
  );
}
