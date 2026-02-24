import { getPayload } from 'payload';
import config from '@payload-config';
import { Container } from '@/components/Container';
import { LocationTabs } from './LocationTabs';

interface Court {
  courtType: 'clay' | 'mini';
  timing: string;
  availableSlots: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  id?: string;
}

interface LocationData {
  id: number | string;
  name: string;
  slug: string;
  courts: Court[];
}

export const metadata = {
  title: 'Court Availability | Flash Sports Academy',
  description: 'Check real-time court availability across our Baluwatar and Budhanilkantha locations.',
};

export default async function AvailabilityPage() {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: 'locations',
    limit: 20,
  });

  const locations: LocationData[] = docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    courts: (doc.courts as Court[]) || [],
  }));

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Court Availability
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            View available courts, timings, and slots at each of our locations.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          {locations.length > 0 ? (
            <LocationTabs locations={locations} />
          ) : (
            <p className="text-center text-zinc-500 dark:text-zinc-400">
              No locations available yet. Check back soon!
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
