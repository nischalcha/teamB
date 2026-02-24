import { getPayload } from 'payload';
import config from '@payload-config';
import { Container } from '@/components/Container';
import { SlotBooking } from './SlotBooking';
import { getCurrentUser } from '@/lib/auth';

interface Court {
  courtType: 'clay' | 'mini';
  timing: string;
  availableSlots: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  id?: string;
}

export interface LocationData {
  id: number | string;
  name: string;
  slug: string;
  courts: Court[];
}

export const metadata = {
  title: 'Book a Court | Flash Sports Academy',
  description: 'Check real-time court availability and book your slot at Flash Sports Academy.',
};

export default async function AvailabilityPage() {
  const payload = await getPayload({ config });
  const user = await getCurrentUser();

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
          <h1 className="font-heading text-3xl font-bold uppercase italic tracking-tight text-black">
            Book a Court
          </h1>
          <p className="mt-4 text-lg text-black/60">
            Pick a location, choose your date, and book an available slot.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          {locations.length > 0 ? (
            <SlotBooking locations={locations} isLoggedIn={!!user} />
          ) : (
            <p className="text-center text-black/50">
              No locations available yet. Check back soon!
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
