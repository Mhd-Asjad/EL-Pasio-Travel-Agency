'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Tag,
  MapPin,
  Package,
  LogOut,
} from 'lucide-react';
import { logoutAdmin } from '@/lib/auth-actions';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Categories',
    href: '/admin/categories',
    icon: Tag,
  },
  {
    label: 'Destinations',
    href: '/admin/destinations',
    icon: MapPin,
  },
  {
    label: 'Packages',
    href: '/admin/packages',
    icon: Package,
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {NAV_LINKS.map((link) => {
        const isActive =
          link.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(link.href);
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-gold-400/10 text-gold-400 border-l-2 border-gold-400 pl-[10px]'
                : 'text-cream/60 hover:text-cream hover:bg-cream/5'
            )}
          >
            <Icon
              className={cn(
                'size-4 shrink-0 transition-colors',
                isActive ? 'text-gold-400' : 'text-cream/40'
              )}
            />
            {link.label}
          </Link>
        );
      })}

      <form action={logoutAdmin} className="pt-6">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-cream/60 transition-colors hover:bg-cream/5 hover:text-cream cursor-pointer"
        >
          <LogOut className="size-4 shrink-0 text-cream/40" />
          Sign out
        </button>
      </form>
    </nav>
  );
}
