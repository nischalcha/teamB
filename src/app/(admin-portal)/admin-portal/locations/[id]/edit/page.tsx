import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import { LocationForm } from '@/components/admin/LocationForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLocationPage({ params }: PageProps) {
  const { id } = await params;
  const payload = await getPayload({ config });

  try {
    const location = await payload.findByID({ collection: 'locations', id });
    const courts = ((location.courts as Array<Record<string, unknown>>) || []).map((c) => ({
      courtType: c.courtType as 'clay' | 'mini',
      timing: c.timing as string,
      availableSlots: c.availableSlots as number,
      level: c.level as 'beginner' | 'intermediate' | 'advanced' | 'all',
    }));

    return (
      <div className="p-6 lg:p-10">
        <Link href="/admin-portal/locations" className="text-sm text-emerald-600 hover:text-emerald-500">&larr; Back to Locations</Link>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Edit Location</h1>
        <div className="mt-6">
          <LocationForm location={{
            id: location.id,
            name: location.name,
            slug: location.slug,
            address: location.address,
            courts,
          }} />
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
