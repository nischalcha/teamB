import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@payload-config';
import { Container } from '@/components/Container';
import { JoinButton } from '@/components/JoinButton';
import { ParallaxImageColumn } from '@/components/ParallaxImageColumn';
import { ParallaxSection } from '@/components/ParallaxSection';
import { getCurrentUser } from '@/lib/auth';

export default async function HomePage() {
  const user = await getCurrentUser();
  const isLoggedIn = !!user;
  const payload = await getPayload({ config });

  const { docs: services } = await payload.find({
    collection: 'services',
    limit: 10,
    depth: 1,
  });

  const { docs: locations } = await payload.find({
    collection: 'locations',
    limit: 10,
    depth: 1,
  });

  const { docs: events } = await payload.find({
    collection: 'events',
    limit: 6,
    depth: 1,
    sort: 'startDate',
  });

  return (
    <>
      {/* ───── Banner (parallax on side images) ───── */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <ParallaxImageColumn
            src="/assests/tennis1.jpg"
            alt="Tennis ball in net"
            speed={0.18}
          />

          <div className="flex flex-col items-center justify-center bg-primary px-8 py-12 text-center md:py-0">
            <span className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-black/60">
              Flash Sports Academy
            </span>
            <h2 className="text-3xl font-extrabold uppercase italic leading-tight text-black md:text-4xl">
              Train With
              <br />
              The Best In
              <br />
              Nepal
            </h2>
            <Link
              href="/availability"
              className="mt-6 rounded-full border-2 border-black bg-black px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-transparent hover:text-black"
            >
              Book Now
            </Link>
          </div>

          <ParallaxImageColumn
            src="/assests/tennis2.jpg"
            alt="Tennis rackets on clay court"
            speed={0.18}
          />
        </div>
      </section>

      

      {/* ───── Services / Programs ───── */}
      <section className="bg-white py-16 sm:py-24">
        <Container>
          <div className="mb-8 flex items-center justify-between px-1">
            <h2 className="text-2xl text-center mx-auto font-bold uppercase italic tracking-tight text-black sm:text-3xl">
              Our Services
            </h2>
            <Link
              href="/availability"
              className="text-sm bg-black rounded-full px-4 py-2 text-white font-semibold transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
            {services.map((service) => {
              const thumbUrl =
                service.thumbnail &&
                typeof service.thumbnail === 'object' &&
                'url' in service.thumbnail
                  ? (service.thumbnail.url as string)
                  : null;

              return (
                <div
                  key={service.id}
                  className="group w-[85%] shrink-0 snap-center overflow-hidden border border-black/10 bg-white shadow-sm transition-shadow hover:shadow-lg sm:w-auto"
                >
                  <div
                    className="relative h-52 w-full bg-black/5 bg-cover bg-center"
                    style={thumbUrl ? { backgroundImage: `url('${thumbUrl}')` } : undefined}
                  >
                    <div className="absolute inset-0 bg-linear-to-t from-black to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="text-xl font-extrabold text-white">
                        NPR {service.price?.toLocaleString()}
                        <span className="text-xs font-normal text-white/60">
                          /{service.pricingUnit}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="mb-2 inline-block bg-primary/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
                      {service.category === 'adults' ? 'Adults' : 'Kids'} &middot;{' '}
                      {service.timing === 'morning' ? 'Morning' : 'Evening'}
                    </span>
                    <h3 className="text-lg font-extrabold uppercase italic leading-tight text-black">
                      {service.name}
                    </h3>
                    <Link
                      href="/availability"
                      className="mt-4 rounded-full block w-full bg-black py-3 text-center text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary hover:text-black"
                    >
                      Join Program
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

{/* ───── Hero (parallax) ───── */}
      <ParallaxSection
        className="h-[620px] w-full sm:h-[840px]"
        backgroundImage="/assests/para4.jpg"
        speed={0.4}
        overlay={<div className="bg-linear-to-t from-black via-black/60 to-transparent" />}
      >
        <div className="absolute inset-x-0 bottom-20 p-6 sm:p-12">
          <Container>
            <div className="mx-auto flex max-w-3xl flex-col items-center justify-center text-center">
              <span className="mb-4 inline-block bg-primary px-1 py-1 text-xs font-bold uppercase tracking-widest text-black">
                Nepal&apos;s #1 Tennis Academy
              </span>
              <h1 className="text-4xl font-extrabold uppercase italic leading-none tracking-tight text-white sm:text-5xl lg:text-6xl">
                Unleash Your
                <span className="text-primary">Tennis Potential</span>
              </h1>
              <p className="mt-4 text-base text-white/70 sm:text-lg">
                World-class coaching and premium clay courts across our Baluwatar
                &amp; Budhanilkantha facilities.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/availability"
                  className="inline-flex rounded-full items-center gap-2 bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wide text-black transition-colors hover:bg-primary-dark"
                >
                  Book Free Lesson
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/players"
                  className="inline-flex rounded-full items-center border-2 border-white px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
                >
                  Meet Our Players
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </ParallaxSection>
      {/* ───── Locations ───── */}
      <section className="bg-black/5 py-16 sm:py-24">
        <Container>
          <div className=" flex flex-col items-center justify-center mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-2xl font-bold uppercase italic tracking-tight text-black sm:text-3xl">
              Our Facilities
            </h2>
            <p className="mt-3 text-base text-black/50">
              Two premier tennis centres in the heart of Kathmandu Valley.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2">
            {locations.map((location) => {
              const courts = (location.courts as Array<{ courtType: string }>) || [];
              const clayCourts = courts.filter((c) => c.courtType === 'clay').length;
              const miniCourts = courts.filter((c) => c.courtType === 'mini').length;

              const thumbUrl =
                location.thumbnail &&
                typeof location.thumbnail === 'object' &&
                'url' in location.thumbnail
                  ? (location.thumbnail.url as string)
                  : null;

              return (
                <div
                  key={location.id}
                  className="group overflow-hidden border border-black/10 bg-white shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-black/5">
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={String(
                          (location.thumbnail as Record<string, unknown>)?.alt || location.name,
                        )}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-black/30">
                        No image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-5">
                      <h3 className="text-xl font-extrabold uppercase italic text-white">
                        {location.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-black/50">{location.address}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {clayCourts > 0 && (
                        <span className="bg-primary/20 px-3 py-1 text-xs font-medium text-black">
                          {clayCourts} Clay Court{clayCourts > 1 ? 's' : ''}
                        </span>
                      )}
                      {miniCourts > 0 && (
                        <span className="bg-black/10 px-3 py-1 text-xs font-medium text-black">
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

      {/* ───── Upcoming Events ───── */}
      {events.length > 0 && (
        <section className="bg-white py-16 sm:py-24">
          <Container>
            <h2 className="mb-8 px-1 text-2xl font-bold uppercase italic tracking-tight text-black sm:text-3xl">
              Upcoming Events
            </h2>

            <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
              {events.map((event) => {
                const coverUrl =
                  event.thumbnail &&
                  typeof event.thumbnail === 'object' &&
                  'url' in event.thumbnail
                    ? (event.thumbnail.url as string)
                    : null;

                const startDate = event.startDate
                  ? new Date(event.startDate as string)
                  : null;

                return (
                  <div
                    key={event.id}
                    className="w-[80%] shrink-0 snap-center overflow-hidden border border-black/10 bg-white shadow-sm transition-shadow hover:shadow-lg sm:w-auto"
                  >
                    <div className="relative h-40 w-full overflow-hidden bg-black/5">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={event.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-primary/10">
                          <svg className="h-10 w-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      {startDate && (
                        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-black/50">
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {startDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                          {event.timing && ` · ${event.timing}`}
                        </div>
                      )}
                      <h3 className="text-base font-bold leading-snug text-black">
                        {event.title}
                      </h3>
                      {event.location &&
                        typeof event.location === 'object' &&
                        'name' in event.location && (
                          <p className="mt-1 text-xs italic text-black/40">
                            {(event.location as Record<string, unknown>).name as string}
                          </p>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* ───── CTA (parallax) ───── */}
      <ParallaxSection
        className="h-[650px]"
        backgroundImage="/assests/para2.jpg"
        speed={0.4}
        overlay={<div className="bg-black/65" />}
      >
        <Container className="flex h-full flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-extrabold uppercase italic tracking-tight text-white sm:text-4xl">
            Ready to Hit the Court?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-white/60">
            Book your free introductory lesson today and experience world-class
            tennis coaching in Kathmandu.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <JoinButton
              isLoggedIn={isLoggedIn}
              href="/availability"
              className="inline-flex rounded-full items-center gap-2 bg-primary px-10 py-4 text-sm font-bold uppercase tracking-wide text-black transition-colors hover:bg-primary-dark"
            >
              Book Your Free Lesson
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </JoinButton>
            <Link
              href="/players"
              className="inline-flex rounded-full items-center border-2 border-white px-10 py-4 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
            >
              Meet Our Players
            </Link>
          </div>
        </Container>
      </ParallaxSection>
    </>
  );
}
