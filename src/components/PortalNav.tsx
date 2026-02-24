'use client';

import Link from 'next/link';
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
  { href: '/admin', label: 'CMS Admin', group: 'other' },
  { href: '/', label: 'Public Site', group: 'other' },
] as const;

const USER_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/availability', label: 'Availability' },
  { href: '/players', label: 'Players' },
  { href: '/', label: 'Home' },
] as const;

export function PortalNav({ user, role }: PortalNavProps) {
  const links = role === 'admin' ? ADMIN_LINKS : USER_LINKS;

  return (
    <aside className="flex w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex h-16 items-center border-b border-zinc-200 px-6 dark:border-zinc-800">
        <Link href="/" className="text-lg font-bold text-emerald-600">
          Flash Sports
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {role === 'admin' ? (
          <>
            <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">Overview</p>
            <nav className="mt-2 flex flex-col gap-1">
              {ADMIN_LINKS.filter((l) => l.group === 'main').map((link) => (
                <Link key={link.href} href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
                  {link.label}
                </Link>
              ))}
            </nav>
            <p className="mb-1 mt-6 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">Manage</p>
            <nav className="mt-2 flex flex-col gap-1">
              {ADMIN_LINKS.filter((l) => l.group === 'manage').map((link) => (
                <Link key={link.href} href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
                  {link.label}
                </Link>
              ))}
            </nav>
            <p className="mb-1 mt-6 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">Other</p>
            <nav className="mt-2 flex flex-col gap-1">
              {ADMIN_LINKS.filter((l) => l.group === 'other').map((link) => (
                <Link key={link.href} href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
                  {link.label}
                </Link>
              ))}
            </nav>
          </>
        ) : (
          <>
            <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">My Account</p>
            <nav className="mt-3 flex flex-col gap-1">
              {USER_LINKS.map((link) => (
                <Link key={link.href} href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
                  {link.label}
                </Link>
              ))}
            </nav>
          </>
        )}
      </div>

      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {user.name}
            </p>
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
              {user.email}
            </p>
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
