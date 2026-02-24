import Link from 'next/link';
import { PlayerForm } from '@/components/admin/PlayerForm';

export default function NewPlayerPage() {
  return (
    <div className="p-6 lg:p-10">
      <Link href="/admin-portal/players" className="text-sm text-black hover:text-primary">&larr; Back to Players</Link>
      <h1 className="mt-4 text-2xl font-bold text-black">Add Player</h1>
      <div className="mt-6">
        <PlayerForm />
      </div>
    </div>
  );
}
