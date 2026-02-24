import Link from 'next/link';
import { LocationForm } from '@/components/admin/LocationForm';

export default function NewLocationPage() {
  return (
    <div className="p-6 lg:p-10">
      <Link href="/admin-portal/locations" className="text-sm text-black hover:text-primary">&larr; Back to Locations</Link>
      <h1 className="mt-4 text-2xl font-bold text-black">Add Location</h1>
      <div className="mt-6">
        <LocationForm />
      </div>
    </div>
  );
}
