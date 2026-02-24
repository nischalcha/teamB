import { getPayload } from 'payload';
import config from '@payload-config';
import Link from 'next/link';
import { DeleteButton } from '@/components/admin/DeleteButton';

export default async function AdminPlayersPage() {
  const payload = await getPayload({ config });
  const { docs: players } = await payload.find({ collection: 'players', limit: 100, depth: 0 });

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Players</h1>
        <Link
          href="/admin-portal/players/new"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary hover:text-black"
        >
          + Add Player
        </Link>
      </div>

      {players.length === 0 ? (
        <p className="text-sm text-black/70">No players yet. Add one to get started.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black/10">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 bg-black/5">
              <tr>
                <th className="px-4 py-3 font-semibold text-black">Name</th>
                <th className="px-4 py-3 font-semibold text-black">Age</th>
                <th className="px-4 py-3 font-semibold text-black">Birthday</th>
                <th className="px-4 py-3 font-semibold text-black">Slug</th>
                <th className="px-4 py-3 text-right font-semibold text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 bg-white">
              {players.map((player) => (
                <tr key={player.id}>
                  <td className="px-4 py-3 font-medium text-black">{player.name}</td>
                  <td className="px-4 py-3 text-black/70">{player.age}</td>
                  <td className="px-4 py-3 text-black/70">
                    {new Date(player.birthday).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-black/70">{player.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin-portal/players/${player.id}/edit`}
                        className="rounded-md border border-black/20 px-3 py-1 text-xs font-medium text-black transition-colors hover:bg-black/5"
                      >
                        Edit
                      </Link>
                      <DeleteButton collection="players" id={player.id} />
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
