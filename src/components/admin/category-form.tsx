'use client';

import { useRef, useTransition } from 'react';
import { Tag, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createCategoryAction } from '@/lib/admin-actions';

export function CategoryCreateForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    const name = String(formData.get('name') ?? '').trim();
    if (!name) {
      toast.error('Please enter a category name');
      return;
    }

    startTransition(async () => {
      try {
        await createCategoryAction(formData);
        formRef.current?.reset();
        toast.success(`Category "${name}" created successfully!`, {
          description: 'It is now available for destinations and filters.',
          icon: <Tag className="size-4 text-gold-400" />,
        });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to create category');
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-xs uppercase tracking-wider text-cream/60 font-semibold mb-2"
        >
          Category Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          disabled={isPending}
          placeholder="e.g. Honeymoon Specials, Kerala"
          className="w-full bg-navy-950 border border-cream/15 text-cream rounded-xl px-4 py-3 focus:outline-none focus:border-gold-400 placeholder:text-cream/25 text-sm transition-colors disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full inline-flex items-center justify-center gap-1.5 bg-gold-400 text-navy-950 font-semibold rounded-xl py-3 hover:bg-gold-300 transition-colors text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="size-3.5 animate-spin" />
            <span>Creating…</span>
          </>
        ) : (
          <>
            <Plus className="size-3.5" />
            <span>Create Category</span>
          </>
        )}
      </button>
    </form>
  );
}
