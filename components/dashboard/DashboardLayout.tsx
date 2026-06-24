'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, MapPin, Heart, Settings } from 'lucide-react';

const navItems = [
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/orders', label: 'Orders', icon: Package },
  { href: '/dashboard/addresses', label: 'Addresses', icon: MapPin },
  { href: '/dashboard/wishlist', label: 'Wishlist', icon: Heart },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="rounded-xl border bg-card p-4 space-y-1 sticky top-24">
            <h2 className="font-bold px-3 py-2 mb-2">My Account</h2>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active ? 'bg-blue-50 text-blue-600 dark:bg-blue-950' : 'hover:bg-accent text-muted-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Content */}
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
