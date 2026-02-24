import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import { ServiceForm } from '@/components/admin/ServiceForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params;
  const payload = await getPayload({ config });

  try {
    const service = await payload.findByID({ collection: 'services', id, depth: 1 });

    const thumbnail = service.thumbnail && typeof service.thumbnail === 'object'
      ? { id: service.thumbnail.id, url: service.thumbnail.url! }
      : null;

    return (
      <div className="p-6 lg:p-10">
        <Link href="/admin-portal/services" className="text-sm text-black hover:text-primary">&larr; Back to Services</Link>
        <h1 className="mt-4 text-2xl font-bold text-black">Edit Service</h1>
        <div className="mt-6">
          <ServiceForm service={{
            id: service.id,
            name: service.name,
            slug: service.slug,
            category: service.category,
            price: service.price,
            pricingUnit: service.pricingUnit,
            timing: service.timing,
            thumbnail,
          }} />
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
