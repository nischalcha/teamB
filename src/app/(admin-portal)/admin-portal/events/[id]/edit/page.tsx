import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import { EventForm } from '@/components/admin/EventForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;
  const payload = await getPayload({ config });

  try {
    const event = await payload.findByID({ collection: 'events', id, depth: 0 });
    const { docs: locations } = await payload.find({ collection: 'locations', limit: 100, depth: 0 });

    return (
      <div className="p-6 lg:p-10">
        <Link href="/admin-portal/events" className="text-sm text-emerald-600 hover:text-emerald-500">&larr; Back to Events</Link>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Edit Event</h1>
        <div className="mt-6">
          <EventForm
            locations={locations.map((l) => ({ id: l.id, name: l.name }))}
            event={{
              id: event.id,
              title: event.title,
              slug: event.slug,
              startDate: event.startDate,
              endDate: event.endDate,
              timing: event.timing || '',
              location: event.location as number,
            }}
          />
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
