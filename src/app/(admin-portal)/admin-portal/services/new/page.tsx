import Link from 'next/link';
import { ServiceForm } from '@/components/admin/ServiceForm';

export default function NewServicePage() {
  return (
    <div className="p-6 lg:p-10">
      <Link href="/admin-portal/services" className="text-sm text-black hover:text-primary">&larr; Back to Services</Link>
      <h1 className="mt-4 text-2xl font-bold text-black">Add Service</h1>
      <div className="mt-6">
        <ServiceForm />
      </div>
    </div>
  );
}
