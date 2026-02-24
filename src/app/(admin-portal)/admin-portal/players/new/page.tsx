import Link from 'next/link';
import { PlayerForm } from '@/components/admin/PlayerForm';

export default function NewPlayerPage() {
  return (
    <div className="p-6 lg:p-10">
      <Link href="/admin-portal/players" className="text-sm text-emerald-600 hover:text-emerald-500">&larr; Back to Players</Link>
      <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Add Player</h1>
      <div className="mt-6">
        <PlayerForm />
      </div>
    </div>
  );
}
