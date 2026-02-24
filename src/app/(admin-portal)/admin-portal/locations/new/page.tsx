import Link from 'next/link';
import { LocationForm } from '@/components/admin/LocationForm';

export default function NewLocationPage() {
  return (
    <div className="p-6 lg:p-10">
      <Link href="/admin-portal/locations" className="text-sm text-emerald-600 hover:text-emerald-500">&larr; Back to Locations</Link>
      <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Add Location</h1>
      <div className="mt-6">
        <LocationForm />
      </div>
    </div>
  );
}
