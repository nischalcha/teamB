import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import { PlayerForm } from '@/components/admin/PlayerForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPlayerPage({ params }: PageProps) {
  const { id } = await params;
  const payload = await getPayload({ config });

  try {
    const player = await payload.findByID({ collection: 'players', id, depth: 1 });

    const profileImage = player.profileImage && typeof player.profileImage === 'object'
      ? { id: player.profileImage.id, url: player.profileImage.url! }
      : null;

    return (
      <div className="p-6 lg:p-10">
        <Link href="/admin-portal/players" className="text-sm text-black hover:text-primary">&larr; Back to Players</Link>
        <h1 className="mt-4 text-2xl font-bold text-black">Edit Player</h1>
        <div className="mt-6">
          <PlayerForm player={{
            id: player.id,
            name: player.name,
            slug: player.slug,
            birthday: player.birthday,
            profileImage,
          }} />
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
