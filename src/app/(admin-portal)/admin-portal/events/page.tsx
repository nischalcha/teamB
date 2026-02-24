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
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Events</h1>
        <Link
          href="/admin-portal/events/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          + Add Event
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-zinc-500">No events yet. Add one to get started.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Title</th>
                <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Date</th>
                <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Timing</th>
                <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Location</th>
                <th className="px-4 py-3 text-right font-semibold text-zinc-700 dark:text-zinc-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
              {events.map((event) => {
                const locationName =
                  event.location && typeof event.location === 'object' && 'name' in event.location
                    ? (event.location as Record<string, unknown>).name as string
                    : '—';
                return (
                  <tr key={event.id}>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{event.title}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {new Date(event.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{event.timing || '—'}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{locationName}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin-portal/events/${event.id}/edit`}
                          className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
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
