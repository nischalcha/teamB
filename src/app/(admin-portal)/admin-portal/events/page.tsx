import { getPayload } from 'payload';
import config from '@payload-config';
import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';

export default async function AdminEventsPage() {
  const payload = await getPayload({ config });
  const { docs: events } = await payload.find({ collection: 'events', limit: 100, depth: 1 });

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Events</h1>
        <Link
          href="/admin-portal/events/new"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary hover:text-black"
        >
          + Add Event
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-black/70">No events yet. Add one to get started.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black/10">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 bg-black/5">
              <tr>
                <th className="px-4 py-3 font-semibold text-black">Title</th>
                <th className="px-4 py-3 font-semibold text-black">Date</th>
                <th className="px-4 py-3 font-semibold text-black">Timing</th>
                <th className="px-4 py-3 font-semibold text-black">Location</th>
                <th className="px-4 py-3 text-right font-semibold text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 bg-white">
              {events.map((event) => {
                const locationName =
                  event.location && typeof event.location === 'object' && 'name' in event.location
                    ? (event.location as Record<string, unknown>).name as string
                    : '—';
                return (
                  <tr key={event.id}>
                    <td className="px-4 py-3 font-medium text-black">{event.title}</td>
                    <td className="px-4 py-3 text-black/70">
                      {new Date(event.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-black/70">{event.timing || '—'}</td>
                    <td className="px-4 py-3 text-black/70">{locationName}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin-portal/events/${event.id}/edit`}
                          className="rounded-md border border-black/20 px-3 py-1 text-xs font-medium text-black transition-colors hover:bg-black/5"
                        >
                          Edit
                        </Link>
                        <DeleteButton collection="events" id={event.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
