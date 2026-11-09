'use client';

import Image from 'next/image';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { createDestination, updateDestination } from '@/lib/admin-actions';
import type { AdminCategory, AdminDestination } from '@/lib/db';
import { ImagePreview } from './image-preview';

type Props = {
  destination?: AdminDestination;
  categories?: AdminCategory[];
};

type State = { success: boolean; error?: string } | null;

export function DestinationForm({ destination, categories = [] }: Props) {
  const isEdit = !!destination;

  // updateDestination.bind(null, id) produces (prevState, formData) => Promise<ActionResult>
  // createDestination already has that signature
  const boundAction = isEdit
    ? updateDestination.bind(null, destination.id)
    : createDestination;

  const [state, formAction, pending] = useActionState(boundAction, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state?.error]);

  return (
    <form action={formAction} className="space-y-6 max-w-xl">
      {state?.error && (
        <div className="rounded-lg border border-red-800 bg-red-900/30 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-cream/70 text-sm font-medium mb-1.5" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={destination?.title}
          placeholder="e.g. Kerala Backwaters"
          className="w-full bg-navy-900 border border-cream/20 text-cream rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold-400 placeholder:text-cream/25 text-sm"
        />
      </div>

      <div>
        <label className="block text-cream/70 text-sm font-medium mb-1.5" htmlFor="categoryId">
          Category
        </label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={destination?.categoryId ?? ''}
          className="w-full bg-navy-900 border border-cream/20 text-cream rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold-400 text-sm cursor-pointer"
        >
          <option value="">Uncategorized</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-cream/70 text-sm font-medium mb-1.5" htmlFor="region">
          Region
        </label>
        <input
          id="region"
          name="region"
          type="text"
          required
          defaultValue={destination?.region}
          placeholder="e.g. Alleppey, India"
          className="w-full bg-navy-900 border border-cream/20 text-cream rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold-400 placeholder:text-cream/25 text-sm"
        />
      </div>

      <div>
        <label className="block text-cream/70 text-sm font-medium mb-1.5" htmlFor="alt">
          Image Alt Text
        </label>
        <input
          id="alt"
          name="alt"
          type="text"
          required
          defaultValue={destination?.alt}
          placeholder="Descriptive alt text for the image"
          className="w-full bg-navy-900 border border-cream/20 text-cream rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold-400 placeholder:text-cream/25 text-sm"
        />
      </div>

      <div>
        <label className="block text-cream/70 text-sm font-medium mb-1.5" htmlFor="image">
          {isEdit ? 'Replace Image (optional)' : 'Image'}
        </label>
        {isEdit && destination.src && (
          <div className="mb-3">
            <p className="text-xs text-cream/40 mb-2">Current image:</p>
            <Image
              src={destination.src}
              alt={destination.alt}
              width={120}
              height={80}
              className="rounded-lg object-cover"
              unoptimized
            />
          </div>
        )}
        <ImagePreview name="image" required={!isEdit} />
      </div>

      <div className="pt-2 flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-gold-400 text-navy-950 font-semibold rounded-full px-6 py-2.5 hover:bg-gold-300 transition-colors text-sm disabled:opacity-50"
        >
          {pending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Destination'}
        </button>
        <a
          href="/admin/destinations"
          className="text-cream/50 font-medium rounded-full px-6 py-2.5 hover:text-cream transition-colors text-sm"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
