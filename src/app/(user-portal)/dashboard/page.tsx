import { getPayload } from 'payload';
import config from '@payload-config';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';

export default async function UserDashboard() {
  const user = await getCurrentUser();
  const payload = await getPayload({ config });

  const { docs: locations } = await payload.find({
    collection: 'locations',
    limit: 20,
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
        <h1 className="text-2xl font-bold text-black">
          Welcome, {user?.name}
        </h1>
        <p className="mt-1 text-sm text-black/50">
          View our services, locations, and upcoming events.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-black">
            Pricing
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between rounded-lg border border-black/10 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-black">
                    {service.name}
                  </p>
                  <p className="text-xs text-black/70">
                    {service.timing === 'morning' ? 'Morning' : 'Evening'} sessions
                  </p>
                </div>
                <p className="text-sm font-bold text-primary">
                  NPR {service.price?.toLocaleString()}/{service.pricingUnit}
                </p>
              </div>
            ))}
            {services.length === 0 && (
              <p className="text-sm text-black/70">No services available yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-black">
            Locations
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {locations.map((location) => (
              <div
                key={location.id}
                className="rounded-lg border border-black/10 p-3"
              >
                <p className="text-sm font-medium text-black">
                  {location.name}
                </p>
                <p className="text-xs text-black/70">
                  {location.address}
                </p>
              </div>
            ))}
            {locations.length === 0 && (
              <p className="text-sm text-black/70">No locations yet.</p>
            )}
          </div>
          <Link
            href="/availability"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            View court availability &rarr;
          </Link>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-black">
            Upcoming Events
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between rounded-lg border border-black/10 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-black">
                    {event.title}
                  </p>
                  <p className="text-xs text-black/70">
                    {event.timing}
                  </p>
                </div>
                <p className="text-xs text-black/50">
                  {new Date(event.startDate).toLocaleDateString()}
                </p>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <p className="text-sm text-black/70">No upcoming events.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
