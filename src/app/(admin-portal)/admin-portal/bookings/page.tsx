import { getPayload } from 'payload';
import config from '@payload-config';

export default async function AdminBookingsPage() {
  const payload = await getPayload({ config });
  const { docs: bookings } = await payload.find({
    collection: 'bookings',
    limit: 100,
    sort: '-createdAt',
    depth: 1,
  });

  return (
    <div className="p-6 lg:p-10">
      <h1 className="mb-6 text-2xl font-bold text-black">Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-sm text-black/70">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black/10">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 bg-black/5">
              <tr>
                <th className="px-4 py-3 font-semibold text-black">User</th>
                <th className="px-4 py-3 font-semibold text-black">Location</th>
                <th className="px-4 py-3 font-semibold text-black">Court</th>
                <th className="px-4 py-3 font-semibold text-black">Date</th>
                <th className="px-4 py-3 font-semibold text-black">Time Slot</th>
                <th className="px-4 py-3 font-semibold text-black">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 bg-white">
              {bookings.map((b) => {
                const locName =
                  b.location && typeof b.location === 'object' && 'name' in b.location
                    ? (b.location as Record<string, unknown>).name as string
                    : '—';
                return (
                  <tr key={b.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-black">{b.userName}</p>
                      <p className="text-xs text-black/50">{b.userEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-black/70">{locName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                        b.courtType === 'clay' ? 'bg-primary/20 text-black' : 'bg-black/10 text-black'
                      }`}>
                        {b.courtType === 'clay' ? 'Clay' : 'Mini'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-black/70">
                      {new Date(b.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-black/70">{b.timeSlot}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                        b.status === 'confirmed'
                          ? 'bg-primary/20 text-black'
                          : 'bg-black/10 text-black/50'
                      }`}>
                        {b.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}
                      </span>
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
