import { getPayload } from 'payload';
import config from '@payload-config';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { CancelButton } from './CancelButton';

const COURT_LABELS: Record<string, string> = {
  clay: 'Clay Court',
  mini: 'Mini Court',
};

export default async function MyBookingsPage() {
  const user = await getCurrentUser();
  const payload = await getPayload({ config });

  const { docs: bookings } = await payload.find({
    collection: 'bookings',
    where: {
      user: { equals: user?.id },
    },
    sort: '-date',
    limit: 50,
    depth: 1,
  });

  const upcoming = bookings.filter((b) => {
    if (b.status === 'cancelled') return false;
    const bookingDate = new Date(b.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate >= today;
  });

  const past = bookings.filter((b) => {
    if (b.status === 'cancelled') return false;
    const bookingDate = new Date(b.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate < today;
  });

  const cancelled = bookings.filter((b) => b.status === 'cancelled');

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">My Bookings</h1>
          <p className="mt-1 text-sm text-black/50">
            View and manage your court reservations.
          </p>
        </div>
        <Link
          href="/availability"
          className="rounded-full bg-black px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary hover:text-black"
        >
          Book a Court
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-black/2 py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
            <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-base font-semibold text-black">No bookings yet</p>
          <p className="mt-1 text-sm text-black/50">
            Head over to the availability page to book your first court.
          </p>
          <Link
            href="/availability"
            className="mt-6 rounded-full bg-black px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary hover:text-black"
          >
            Browse Availability
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                </div>
                <h2 className="font-heading text-lg font-bold uppercase text-black">
                  Upcoming
                  <span className="ml-2 text-sm font-normal normal-case text-black/40">
                    ({upcoming.length})
                  </span>
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {upcoming.map((booking) => {
                  const loc = typeof booking.location === 'object' ? booking.location : null;
                  const locationName = loc ? (loc as Record<string, unknown>).name as string : '—';
                  const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={booking.id}
                      className="group relative overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
                      <div className="p-5 pl-6">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <p className="text-sm font-bold text-black">{locationName}</p>
                            <p className="mt-0.5 text-xs text-black/50">
                              {COURT_LABELS[booking.courtType] || booking.courtType}
                            </p>
                          </div>
                          <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                            Confirmed
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-black/70">
                            <svg className="h-4 w-4 text-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formattedDate}
                          </div>
                          <div className="flex items-center gap-1.5 text-black/70">
                            <svg className="h-4 w-4 text-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {booking.timeSlot}
                          </div>
                        </div>
                        <div className="mt-4 border-t border-black/5 pt-3">
                          <CancelButton bookingId={booking.id} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Past */}
          {past.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10">
                  <div className="h-2.5 w-2.5 rounded-full bg-black/30" />
                </div>
                <h2 className="font-heading text-lg font-bold uppercase text-black/60">
                  Past
                  <span className="ml-2 text-sm font-normal normal-case text-black/40">
                    ({past.length})
                  </span>
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {past.map((booking) => {
                  const loc = typeof booking.location === 'object' ? booking.location : null;
                  const locationName = loc ? (loc as Record<string, unknown>).name as string : '—';
                  const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={booking.id}
                      className="overflow-hidden rounded-xl border border-black/10 bg-black/2"
                    >
                      <div className="p-5">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <p className="text-sm font-bold text-black/60">{locationName}</p>
                            <p className="mt-0.5 text-xs text-black/40">
                              {COURT_LABELS[booking.courtType] || booking.courtType}
                            </p>
                          </div>
                          <span className="rounded-full bg-black/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-black/40">
                            Completed
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-black/40">
                          <div className="flex items-center gap-1.5">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formattedDate}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {booking.timeSlot}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Cancelled */}
          {cancelled.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                </div>
                <h2 className="font-heading text-lg font-bold uppercase text-black/60">
                  Cancelled
                  <span className="ml-2 text-sm font-normal normal-case text-black/40">
                    ({cancelled.length})
                  </span>
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {cancelled.map((booking) => {
                  const loc = typeof booking.location === 'object' ? booking.location : null;
                  const locationName = loc ? (loc as Record<string, unknown>).name as string : '—';
                  const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={booking.id}
                      className="overflow-hidden rounded-xl border border-red-100 bg-red-50/30"
                    >
                      <div className="p-5">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <p className="text-sm font-bold text-black/50 line-through">{locationName}</p>
                            <p className="mt-0.5 text-xs text-black/30">
                              {COURT_LABELS[booking.courtType] || booking.courtType}
                            </p>
                          </div>
                          <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-500">
                            Cancelled
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-black/30">
                          <div className="flex items-center gap-1.5">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formattedDate}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {booking.timeSlot}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
