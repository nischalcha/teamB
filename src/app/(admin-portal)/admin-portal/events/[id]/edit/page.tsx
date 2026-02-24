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
    const event = await payload.findByID({ collection: 'events', id, depth: 1 });
    const { docs: locations } = await payload.find({ collection: 'locations', limit: 100, depth: 0 });

    const thumbnail = event.thumbnail && typeof event.thumbnail === 'object'
      ? { id: event.thumbnail.id, url: event.thumbnail.url! }
      : null;

    const images = (event.images ?? [])
      .map((item) => {
        const img = item.image;
        if (img && typeof img === 'object') {
          return { id: img.id, url: img.url! };
        }
        return null;
      })
      .filter((x): x is { id: number; url: string } => x !== null);

    return (
      <div className="p-6 lg:p-10">
        <Link href="/admin-portal/events" className="text-sm text-black hover:text-primary">&larr; Back to Events</Link>
        <h1 className="mt-4 text-2xl font-bold text-black">Edit Event</h1>
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
              location: typeof event.location === 'object' ? event.location.id : (event.location as number),
              thumbnail,
              images,
            }}
          />
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
