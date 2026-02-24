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
    const service = await payload.findByID({ collection: 'services', id });
    return (
      <div className="p-6 lg:p-10">
        <Link href="/admin-portal/services" className="text-sm text-emerald-600 hover:text-emerald-500">&larr; Back to Services</Link>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Edit Service</h1>
        <div className="mt-6">
          <ServiceForm service={{
            id: service.id,
            name: service.name,
            slug: service.slug,
            category: service.category,
            price: service.price,
            pricingUnit: service.pricingUnit,
            timing: service.timing,
          }} />
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
