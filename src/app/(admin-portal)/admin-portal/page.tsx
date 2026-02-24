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
    { label: 'Total Users', value: users.totalDocs, color: 'bg-black' },
    { label: 'Players', value: players.totalDocs, color: 'bg-primary' },
    { label: 'Locations', value: locations.totalDocs, color: 'bg-black/60' },
    { label: 'Services', value: services.totalDocs, color: 'bg-black/40' },
    { label: 'Events', value: events.totalDocs, color: 'bg-black/80' },
  ];

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-black/70">
          Welcome back, {user?.name}. Here&apos;s an overview of Flash Sports Academy.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-black/10 bg-white p-5 shadow-sm"
          >
            <div className={`mb-3 h-2 w-8 rounded-full ${stat.color}`} />
            <p className="text-2xl font-bold text-black">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-black/70">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-black">
            Quick Actions
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            <a
              href="/admin"
              className="flex items-center gap-3 rounded-lg border border-black/10 p-3 text-sm font-medium text-black transition-colors hover:bg-black/5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-black">
                CMS
              </span>
              Open Payload CMS Admin
            </a>
            <a
              href="/"
              className="flex items-center gap-3 rounded-lg border border-black/10 p-3 text-sm font-medium text-black transition-colors hover:bg-black/5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/10 text-black">
                WEB
              </span>
              View Public Website
            </a>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-black">
            Locations Overview
          </h2>
          <div className="mt-4 text-sm text-black/70">
            <p>Baluwatar — 2 clay courts, 1 mini court</p>
            <p className="mt-2">Budhanilkantha — 4 clay courts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
