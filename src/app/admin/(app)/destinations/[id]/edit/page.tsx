import { notFound } from 'next/navigation';
import { getDestinations, getCategories } from '@/lib/db';
import { DestinationForm } from '@/components/admin/destination-form';

export const instant = false;

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditDestinationPage({ params }: Props) {
  const { id } = await params;
  const [destinations, categories] = await Promise.all([
    getDestinations(),
    getCategories(),
  ]);
  const destination = destinations.find((d) => d.id === id);

  if (!destination) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-cream tracking-tight">Edit Destination</h1>
        <p className="mt-1 text-cream/50 text-sm">Editing: <span className="text-cream/70">{destination.title}</span></p>
      </div>
      <div className="bg-navy-900 rounded-xl border border-cream/10 p-6">
        <DestinationForm destination={destination} categories={categories} />
      </div>
    </div>
  );
}
