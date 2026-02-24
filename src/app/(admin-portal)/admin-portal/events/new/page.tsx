import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@payload-config';
import { EventForm } from '@/components/admin/EventForm';

export default async function NewEventPage() {
  const payload = await getPayload({ config });
  const { docs: locations } = await payload.find({ collection: 'locations', limit: 100, depth: 0 });

  return (
    <div className="p-6 lg:p-10">
      <Link href="/admin-portal/events" className="text-sm text-black hover:text-primary">&larr; Back to Events</Link>
      <h1 className="mt-4 text-2xl font-bold text-black">Add Event</h1>
      <div className="mt-6">
        <EventForm locations={locations.map((l) => ({ id: l.id, name: l.name }))} />
      </div>
    </div>
  );
}
