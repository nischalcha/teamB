import { getPayload } from 'payload';
import config from '@payload-config';
import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';

export default async function AdminServicesPage() {
  const payload = await getPayload({ config });
  const { docs: services } = await payload.find({ collection: 'services', limit: 100 });

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Services</h1>
        <Link
          href="/admin-portal/services/new"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary hover:text-black"
        >
          + Add Service
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="text-sm text-black/70">No services yet. Add one to get started.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black/10">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 bg-black/5">
              <tr>
                <th className="px-4 py-3 font-semibold text-black">Name</th>
                <th className="px-4 py-3 font-semibold text-black">Category</th>
                <th className="px-4 py-3 font-semibold text-black">Price</th>
                <th className="px-4 py-3 font-semibold text-black">Timing</th>
                <th className="px-4 py-3 text-right font-semibold text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 bg-white">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-4 py-3 font-medium text-black">{service.name}</td>
                  <td className="px-4 py-3 text-black/70 capitalize">{service.category}</td>
                  <td className="px-4 py-3 text-black/70">
                    NPR {service.price?.toLocaleString()}/{service.pricingUnit}
                  </td>
                  <td className="px-4 py-3 text-black/70 capitalize">{service.timing}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin-portal/services/${service.id}/edit`}
                        className="rounded-md border border-black/20 px-3 py-1 text-xs font-medium text-black transition-colors hover:bg-black/5"
                      >
                        Edit
                      </Link>
                      <DeleteButton collection="services" id={service.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
