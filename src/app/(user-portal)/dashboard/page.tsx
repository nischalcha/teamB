import { getPayload } from 'payload';
import config from '@payload-config';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';

export default async function UserDashboard() {
  const user = await getCurrentUser();
  const payload = await getPayload({ config });

  const { docs: locations } = await payload.find({
    collection: 'locations',
    limit: 10,
    depth: 0,
  });

  const { docs: services } = await payload.find({
    collection: 'services',
    limit: 10,
  });

  const { docs: upcomingEvents } = await payload.find({
    collection: 'events',
    limit: 5,
    sort: '-startDate',
  });

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Welcome, {user?.name}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Your Flash Sports Academy dashboard.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Available Services */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Our Services
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between rounded-lg border border-zinc-100 p-3 dark:border-zinc-800"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {service.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {service.timing === 'morning' ? 'Morning' : 'Evening'} sessions
                  </p>
                </div>
                <p className="text-sm font-bold text-emerald-600">
                  NPR {service.price?.toLocaleString()}/{service.pricingUnit}
                </p>
              </div>
            ))}
            {services.length === 0 && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No services available yet.</p>
            )}
          </div>
        </div>

        {/* Locations */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Locations
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {locations.map((location) => (
              <div
                key={location.id}
                className="rounded-lg border border-zinc-100 p-3 dark:border-zinc-800"
              >
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {location.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {location.address}
                </p>
              </div>
            ))}
            {locations.length === 0 && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No locations yet.</p>
            )}
          </div>
          <Link
            href="/availability"
            className="mt-4 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-500"
          >
            View court availability &rarr;
          </Link>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-2 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Upcoming Events
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between rounded-lg border border-zinc-100 p-3 dark:border-zinc-800"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {event.title}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {event.timing}
                  </p>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(event.startDate).toLocaleDateString()}
                </p>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No upcoming events.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
