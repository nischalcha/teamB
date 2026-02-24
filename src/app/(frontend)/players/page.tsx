import { getPayload } from 'payload';
import config from '@payload-config';
import { Container } from '@/components/Container';
import { AgeFilter } from './AgeFilter';

interface PlayerData {
  id: number | string;
  name: string;
  age: number;
  profileImage: { url: string; alt: string } | null;
  achievements: unknown;
}

export const metadata = {
  title: 'Player Directory | Flash Sports Academy',
  description: 'Meet our talented players at Flash Sports Academy.',
};

interface PageProps {
  searchParams: Promise<{ minAge?: string; maxAge?: string }>;
}

export default async function PlayersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const payload = await getPayload({ config });

  const whereClause: Record<string, unknown> = {};
  const minAge = params.minAge ? parseInt(params.minAge, 10) : undefined;
  const maxAge = params.maxAge ? parseInt(params.maxAge, 10) : undefined;

  if (minAge !== undefined && !isNaN(minAge)) {
    whereClause['age'] = { ...(whereClause['age'] as Record<string, unknown>), greater_than_equal: minAge };
  }
  if (maxAge !== undefined && !isNaN(maxAge)) {
    whereClause['age'] = { ...(whereClause['age'] as Record<string, unknown>), less_than_equal: maxAge };
  }

  const { docs } = await payload.find({
    collection: 'players',
    limit: 50,
    depth: 1,
    where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
  });

  const players: PlayerData[] = docs.map((doc) => {
    let profileImage: PlayerData['profileImage'] = null;
    if (doc.profileImage && typeof doc.profileImage === 'object' && 'url' in doc.profileImage) {
      profileImage = {
        url: doc.profileImage.url as string,
        alt: (doc.profileImage as Record<string, unknown>).alt as string || doc.name,
      };
    }

    return {
      id: doc.id,
      name: doc.name,
      age: doc.age,
      profileImage,
      achievements: doc.achievements,
    };
  });

  return (
    <section className="py-16 sm:py-12">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 uppercase">
            Players
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Meet the talented athletes training at Flash Sports Academy.
          </p>
        </div>

        

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {players.length === 0 ? (
            <p className="col-span-full text-center text-zinc-500 dark:text-zinc-400">
              No players found matching the filter criteria.
            </p>
          ) : (
            players.map((player) => (
              <div
                key={player.id}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                {player.profileImage ? (
                  <div className="aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={player.profileImage.url}
                      alt={player.profileImage.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                    <span className="text-4xl font-bold text-zinc-300 dark:text-zinc-600">
                      {player.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {player.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Age: {player.age}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Container>
    </section>
  );
}
