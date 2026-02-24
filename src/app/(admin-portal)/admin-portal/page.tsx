import { getPayload } from 'payload';
import config from '@payload-config';
import { getCurrentUser } from '@/lib/auth';

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  const payload = await getPayload({ config });

  const [players, locations, services, events, users] = await Promise.all([
    payload.count({ collection: 'players' }),
    payload.count({ collection: 'locations' }),
    payload.count({ collection: 'services' }),
    payload.count({ collection: 'events' }),
    payload.count({ collection: 'users' }),
  ]);

  const stats = [
    { label: 'Total Users', value: users.totalDocs, color: 'bg-blue-500' },
    { label: 'Players', value: players.totalDocs, color: 'bg-emerald-500' },
    { label: 'Locations', value: locations.totalDocs, color: 'bg-amber-500' },
    { label: 'Services', value: services.totalDocs, color: 'bg-purple-500' },
    { label: 'Events', value: events.totalDocs, color: 'bg-rose-500' },
  ];

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Welcome back, {user?.name}. Here&apos;s an overview of Flash Sports Academy.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className={`mb-3 h-2 w-8 rounded-full ${stat.color}`} />
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Quick Actions
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            <a
              href="/admin"
              className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                CMS
              </span>
              Open Payload CMS Admin
            </a>
            <a
              href="/"
              className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                WEB
              </span>
              View Public Website
            </a>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Locations Overview
          </h2>
          <div className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            <p>Baluwatar — 2 clay courts, 1 mini court</p>
            <p className="mt-2">Budhanilkantha — 4 clay courts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
