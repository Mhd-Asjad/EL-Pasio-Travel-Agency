'use client';

import { useState, useTransition } from 'react';
import { Star, Sparkles, CircleOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { togglePackageFeaturedAction } from '@/lib/admin-actions';

type Props = {
  packageId: string;
  initialFeatured: boolean;
  label?: string;
  showText?: boolean;
};

export function FeaturedToggle({
  packageId,
  initialFeatured,
  label = 'Package',
  showText = true,
}: Props) {
  const [isFeatured, setIsFeatured] = useState<boolean>(initialFeatured);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const nextFeatured = !isFeatured;
    setIsFeatured(nextFeatured);

    startTransition(async () => {
      const res = await togglePackageFeaturedAction(packageId, nextFeatured);

      if (res?.success === false) {
        setIsFeatured(!nextFeatured);
        toast.error(res.error || 'Failed to update featured status', {
          description: 'Please try again or check your database connection.',
        });
        return;
      }

      if (nextFeatured) {
        toast.success(`"${label}" is now Featured`, {
          description: 'It will appear in the Travel Packages section on the homepage.',
          icon: <Sparkles className="size-4 text-gold-400" />,
        });
      } else {
        toast.info(`"${label}" removed from Featured`, {
          description: 'It has been hidden from the homepage packages slider.',
          icon: <CircleOff className="size-4 text-cream/50" />,
        });
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      aria-pressed={isFeatured}
      title={isFeatured ? 'Click to unmark as featured' : 'Click to mark as featured on homepage'}
      className={`group relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
        isFeatured
          ? 'bg-gold-400/15 text-gold-400 border border-gold-400/40 hover:bg-gold-400/25 hover:border-gold-400/60 shadow-[0_0_12px_rgba(242,207,120,0.15)]'
          : 'bg-cream/5 text-cream/45 border border-cream/15 hover:text-gold-300 hover:border-gold-400/40 hover:bg-gold-400/5'
      } ${isPending ? 'opacity-70 scale-95' : 'hover:scale-105 active:scale-95'}`}
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin text-gold-400" />
      ) : (
        <Star
          className={`size-3.5 transition-transform duration-200 ${
            isFeatured
              ? 'fill-gold-400 text-gold-400 drop-shadow-[0_0_4px_rgba(242,207,120,0.5)]'
              : 'text-cream/40 group-hover:text-gold-300 group-hover:scale-110'
          }`}
        />
      )}

      {showText && (
        <span className="tracking-wide">
          {isFeatured ? 'Featured' : 'Feature'}
        </span>
      )}
    </button>
  );
}
