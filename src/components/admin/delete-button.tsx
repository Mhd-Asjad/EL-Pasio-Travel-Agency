'use client';

import { useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  action: () => Promise<{ success: boolean; error?: string }>;
  label?: string;
  itemName?: string;
  itemType?: string;
};

export function DeleteButton({
  action,
  label = 'Delete',
  itemName,
  itemType = 'item',
}: Props) {
  const [isPending, startTransition] = useTransition();

  function executeDelete() {
    startTransition(async () => {
      const deletePromise = (async () => {
        const res = await action();
        if (res && res.success === false) {
          throw new Error(res.error || `Failed to delete ${itemType}`);
        }
        return res;
      })();

      toast.promise(deletePromise, {
        loading: `Deleting ${itemType}...`,
        success: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} deleted successfully`,
        error: (err) => (err instanceof Error ? err.message : `Failed to delete ${itemType}`),
      });
    });
  }

  function handleClick() {
    const title = itemName ? `Delete "${itemName}"?` : `Delete this ${itemType}?`;

    toast(title, {
      description: 'This action is permanent and cannot be undone.',
      duration: 7000,
      icon: <Trash2 className="size-4 text-red-400" />,
      action: {
        label: 'Delete',
        onClick: () => executeDelete(),
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      title={`Delete ${itemType}`}
      className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-300 border border-red-500/25 rounded-full px-3 py-1.5 hover:bg-red-500/20 hover:border-red-500/40 text-xs transition-colors disabled:opacity-50 font-medium cursor-pointer"
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Trash2 className="size-3.5" />
      )}
      <span>{isPending ? 'Deleting…' : label}</span>
    </button>
  );
}
