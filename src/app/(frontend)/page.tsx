import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@payload-config';
import { Container } from '@/components/Container';

export default async function HomePage() {
  const payload = await getPayload({ config });

  const { docs: services } = await payload.find({
    collection: 'services',
    limit: 10,
  });

  const { docs: locations } = await payload.find({
    collection: 'locations',
    limit: 10,
    depth: 1,
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-emerald-700 py-24 text-white sm:py-32">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-800 to-emerald-600" />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Flash Sports Academy
            </h1>
            <p className="mt-6 text-lg leading-8 text-emerald-100">
              Nepal&apos;s premier tennis training facility. Professional coaching for
              adults and kids across our Baluwatar and Budhanilkantha locations.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/availability"
                className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-50"
              >
                Book Your Free Lesson
              </Link>
              <Link
                href="/players"
                className="rounded-full border border-white/30 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Meet Our Players
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Our Services
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Professional tennis training for all ages and skill levels.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {service.category === 'adults' ? 'Adults' : 'Kids'}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {service.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-emerald-600">
                    NPR {service.price?.toLocaleString()}
                  </span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    / {service.pricingUnit}
                  </span>
                </div>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                  {service.timing === 'morning' ? 'Morning' : 'Evening'} sessions
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Locations Section */}
      <section className="bg-zinc-50 py-16 sm:py-24 dark:bg-zinc-900/50">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Our Locations
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Two premier facilities in the Kathmandu Valley.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-2">
            {locations.map((location) => {
              const courtSummary = (location.courts as Array<{ courtType: string }>) || [];
              const clayCourts = courtSummary.filter((c) => c.courtType === 'clay').length;
              const miniCourts = courtSummary.filter((c) => c.courtType === 'mini').length;

              return (
                <div
                  key={location.id}
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {location.thumbnail &&
                    typeof location.thumbnail === 'object' &&
                    'url' in location.thumbnail &&
                    location.thumbnail.url && (
                      <div className="aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        <img
                          src={location.thumbnail.url as string}
                          alt={String((location.thumbnail as Record<string, unknown>).alt || location.name)}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                      {location.name}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                      {location.address}
                    </p>
                    <div className="mt-4 flex gap-4">
                      {clayCourts > 0 && (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                          {clayCourts} Clay Court{clayCourts > 1 ? 's' : ''}
                        </span>
                      )}
                      {miniCourts > 0 && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          {miniCourts} Mini Court{miniCourts > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl rounded-2xl bg-emerald-700 px-8 py-12 text-center text-white shadow-xl sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to Start Playing?
            </h2>
            <p className="mt-4 text-lg text-emerald-100">
              Book your free introductory lesson today and experience world-class
              tennis coaching in Kathmandu.
            </p>
            <Link
              href="/availability"
              className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-50"
            >
              Book Your Free Lesson
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
