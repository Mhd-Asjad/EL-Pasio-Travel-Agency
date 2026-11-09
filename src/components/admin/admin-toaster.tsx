'use client';

import { Toaster } from 'sonner';

export function AdminToaster() {
  return (
    <Toaster
      position="top-right"
      theme="dark"
      closeButton
      richColors={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#0b1b33',
          border: '1px solid rgba(247, 243, 235, 0.12)',
          color: '#f7f3eb',
          borderRadius: '16px',
          boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.6), 0 0 15px rgba(242, 207, 120, 0.05)',
        },
        classNames: {
          toast: 'group border border-cream/15 font-sans shadow-2xl',
          title: 'text-sm font-semibold text-cream',
          description: 'text-xs text-cream/70 mt-0.5',
          actionButton: '!bg-gold-400 !text-navy-950 font-semibold !text-xs !rounded-full !px-3 !py-1 hover:!bg-gold-300 transition-colors',
          cancelButton: '!bg-cream/10 !text-cream !text-xs !rounded-full !px-3 !py-1 hover:!bg-cream/20 transition-colors',
          closeButton: '!bg-navy-950 !border !border-cream/20 !text-cream hover:!bg-navy-900',
        },
      }}
    />
  );
}
