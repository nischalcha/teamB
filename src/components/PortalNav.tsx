'use client';

import Link from 'next/link';
import { IoIosFlash } from 'react-icons/io';
import { logoutAction } from '@/lib/actions/auth';
import type { AuthUser } from '@/lib/auth';

interface PortalNavProps {
  user: AuthUser;
  role: 'user' | 'admin';
}

const ADMIN_LINKS = [
  { href: '/admin-portal', label: 'Dashboard', group: 'main' },
  { href: '/admin-portal/players', label: 'Players', group: 'manage' },
  { href: '/admin-portal/locations', label: 'Locations', group: 'manage' },
  { href: '/admin-portal/services', label: 'Services', group: 'manage' },
  { href: '/admin-portal/events', label: 'Events', group: 'manage' },
  { href: '/admin-portal/bookings', label: 'Bookings', group: 'manage' },
  { href: '/admin', label: 'CMS Admin', group: 'other' },
  { href: '/', label: 'Public Site', group: 'other' },
] as const;

const USER_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/bookings', label: 'My Bookings' },
  { href: '/availability', label: 'Availability' },
  { href: '/players', label: 'Players' },
  { href: '/', label: 'Home' },
] as const;

export function PortalNav({ user, role }: PortalNavProps) {
  const links = role === 'admin' ? ADMIN_LINKS : USER_LINKS;

  return (
    <aside className="flex w-72 flex-col border-r border-black/10 bg-white">
      <div className="flex h-18 items-center border-b border-black/10 px-7">
        <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold uppercase text-black">
          <IoIosFlash className="h-7 w-7 text-primary" />
          Flash Sports Academy
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-7">
        {role === 'admin' ? (
          <>
            <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-black/50">Overview</p>
            <nav className="mt-2 flex flex-col gap-1">
              {ADMIN_LINKS.filter((l) => l.group === 'main').map((link) => (
                <Link key={link.href} href={link.href}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-black/70 transition-colors hover:bg-primary/10 hover:text-black">
                  {link.label}
                </Link>
              ))}
            </nav>
            <p className="mb-1 mt-6 px-2 text-xs font-semibold uppercase tracking-wider text-black/50">Manage</p>
            <nav className="mt-2 flex flex-col gap-1">
              {ADMIN_LINKS.filter((l) => l.group === 'manage').map((link) => (
                <Link key={link.href} href={link.href}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-black/70 transition-colors hover:bg-primary/10 hover:text-black">
                  {link.label}
                </Link>
              ))}
            </nav>
            <p className="mb-1 mt-6 px-2 text-xs font-semibold uppercase tracking-wider text-black/50">Other</p>
            <nav className="mt-2 flex flex-col gap-1">
              {ADMIN_LINKS.filter((l) => l.group === 'other').map((link) => (
                <Link key={link.href} href={link.href}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-black/70 transition-colors hover:bg-primary/10 hover:text-black">
                  {link.label}
                </Link>
              ))}
            </nav>
          </>
        ) : (
          <>
            <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-black/50">My Account</p>
            <nav className="mt-3 flex flex-col gap-1">
              {USER_LINKS.map((link) => (
                <Link key={link.href} href={link.href}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-black/70 transition-colors hover:bg-primary/10 hover:text-black">
                  {link.label}
                </Link>
              ))}
            </nav>
          </>
        )}
      </div>

      <div className="border-t border-black/10 p-5">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-base font-bold text-black">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-medium text-black">
              {user.name}
            </p>
            <p className="truncate text-sm text-black/50">
              {user.email}
            </p>
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full rounded-lg border border-black/20 px-3 py-2.5 text-base font-medium text-black/70 transition-colors hover:bg-black/5"
          >
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
