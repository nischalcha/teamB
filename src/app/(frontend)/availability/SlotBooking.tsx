'use client';

import { useState, useTransition, useEffect, useCallback, useRef } from 'react';
import { bookSlotAction, getBookingsForDate } from '@/lib/actions/slot-booking';
import { AuthModal } from '@/components/AuthModal';
import type { LocationData } from './page';

const TIME_SLOTS = [
  '6:00 AM - 7:00 AM',
  '7:00 AM - 8:00 AM',
  '8:00 AM - 9:00 AM',
  '9:00 AM - 10:00 AM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM',
  '6:00 PM - 7:00 PM',
];

const COURT_LABELS: Record<string, string> = {
  clay: 'Clay Court',
  mini: 'Mini Court',
};

interface PendingBooking {
  courtType: string;
  timeSlot: string;
}

interface Props {
  locations: LocationData[];
  isLoggedIn: boolean;
}

export function SlotBooking({ locations, isLoggedIn }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({});
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null);
  const confirmOverlayRef = useRef<HTMLDivElement>(null);

  const handleCloseAuthModal = useCallback(() => setShowAuthModal(false), []);

  const active = locations[activeIndex];
  const courtTypes = [...new Set(active.courts.map((c) => c.courtType))];

  const getMaxSlots = useCallback(
    (courtType: string) => {
      const court = active.courts.find((c) => c.courtType === courtType);
      return court?.availableSlots ?? 0;
    },
    [active.courts],
  );

  useEffect(() => {
    setLoadingSlots(true);
    getBookingsForDate(active.id, selectedDate).then((counts) => {
      setBookingCounts(counts);
      setLoadingSlots(false);
    });
  }, [active.id, selectedDate]);

  useEffect(() => {
    if (!pendingBooking) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPendingBooking(null);
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [pendingBooking]);

  function handleBookClick(courtType: string, timeSlot: string) {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    setPendingBooking({ courtType, timeSlot });
  }

  function confirmBooking() {
    if (!pendingBooking) return;
    setMessage(null);

    const fd = new FormData();
    fd.set('locationId', String(active.id));
    fd.set('courtType', pendingBooking.courtType);
    fd.set('date', selectedDate);
    fd.set('timeSlot', pendingBooking.timeSlot);

    startTransition(async () => {
      const result = await bookSlotAction(fd);
      setMessage({ text: result.message, success: result.success });
      setPendingBooking(null);
      if (result.success) {
        const counts = await getBookingsForDate(active.id, selectedDate);
        setBookingCounts(counts);
      }
    });
  }

  const today = new Date().toISOString().split('T')[0];

  const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div>
      <AuthModal open={showAuthModal} onClose={handleCloseAuthModal} />

      {/* Confirmation Modal */}
      {pendingBooking && (
        <div
          ref={confirmOverlayRef}
          onClick={(e) => {
            if (e.target === confirmOverlayRef.current) setPendingBooking(null);
          }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <div className="relative mx-4 w-full max-w-md animate-[modalIn_0.25s_ease-out] overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="h-1.5 w-full bg-primary" />

            <button
              type="button"
              onClick={() => setPendingBooking(null)}
              className="absolute right-4 top-5 flex h-8 w-8 items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/5 hover:text-black"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col px-8 pb-8 pt-10">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
                <svg className="h-7 w-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <h3 className="font-heading text-xl font-bold uppercase italic tracking-tight text-black">
                Confirm Booking
              </h3>
              <p className="mt-2 text-sm text-black/50">
                Please review the details before confirming.
              </p>

              <div className="mt-6 space-y-3 rounded-xl border border-black/10 bg-black/[0.02] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-black/40">Location</span>
                  <span className="text-sm font-semibold text-black">{active.name}</span>
                </div>
                <div className="h-px bg-black/5" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-black/40">Court</span>
                  <span className="text-sm font-semibold text-black">
                    {COURT_LABELS[pendingBooking.courtType] || pendingBooking.courtType}
                  </span>
                </div>
                <div className="h-px bg-black/5" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-black/40">Date</span>
                  <span className="text-sm font-semibold text-black">{formattedDate}</span>
                </div>
                <div className="h-px bg-black/5" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-black/40">Time</span>
                  <span className="text-sm font-semibold text-primary">{pendingBooking.timeSlot}</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setPendingBooking(null)}
                  className="flex h-12 flex-1 items-center justify-center rounded-full border-2 border-black/15 text-sm font-semibold text-black transition-colors hover:border-black/30 hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={confirmBooking}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-black text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary hover:text-black disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Booking…
                    </>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes modalIn {
              from {
                opacity: 0;
                transform: scale(0.95) translateY(8px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
          `}</style>
        </div>
      )}

      {/* Location tabs */}
      <div className="flex gap-2 border-b border-black/10">
        {locations.map((loc, idx) => (
          <button
            key={loc.id}
            type="button"
            onClick={() => {
              setActiveIndex(idx);
              setMessage(null);
            }}
            className={`px-5 py-3 font-heading text-sm font-semibold uppercase transition-colors ${
              idx === activeIndex
                ? 'border-b-2 border-primary text-primary'
                : 'text-black/50 hover:text-black'
            }`}
          >
            {loc.name}
          </button>
        ))}
      </div>

      {/* Date picker */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <label htmlFor="slot-date" className="text-sm font-medium text-black">
          Select Date
        </label>
        <input
          id="slot-date"
          type="date"
          value={selectedDate}
          min={today}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setMessage(null);
          }}
          className="h-10 rounded-lg border border-black/20 bg-white px-3 text-sm text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <span className="text-sm text-black/50">{formattedDate}</span>
      </div>

      {/* Status message */}
      {message && (
        <div
          className={`mt-4 rounded-lg px-4 py-3 text-sm ${
            message.success ? 'bg-primary/20 text-black' : 'bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Slot grid */}
      {loadingSlots ? (
        <div className="mt-8 flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-primary" />
        </div>
      ) : courtTypes.length === 0 ? (
        <p className="mt-8 text-center text-black/50">
          No courts configured for this location yet.
        </p>
      ) : (
        <div className="mt-8 space-y-10">
          {courtTypes.map((ct) => {
            const maxSlots = getMaxSlots(ct);
            return (
              <div key={ct}>
                <h3 className="mb-4 font-heading text-lg font-bold uppercase text-black">
                  {COURT_LABELS[ct] || ct}{' '}
                  <span className="text-sm font-normal normal-case text-black/50">
                    ({maxSlots} {maxSlots === 1 ? 'slot' : 'slots'} per session)
                  </span>
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {TIME_SLOTS.map((slot) => {
                    const key = `${ct}::${slot}`;
                    const booked = bookingCounts[key] || 0;
                    const remaining = Math.max(0, maxSlots - booked);
                    const full = remaining <= 0;

                    return (
                      <div
                        key={slot}
                        className={`rounded-xl border p-4 transition-colors ${
                          full
                            ? 'border-black/10 bg-black/5'
                            : 'border-black/10 bg-white hover:border-primary/50'
                        }`}
                      >
                        <p className="text-sm font-semibold text-black">{slot}</p>
                        <p className={`mt-1 text-xs ${full ? 'text-black/40' : 'text-primary font-medium'}`}>
                          {full ? 'Fully booked' : `${remaining} ${remaining === 1 ? 'slot' : 'slots'} available`}
                        </p>
                        {!full && (
                          <button
                            type="button"
                            onClick={() => handleBookClick(ct, slot)}
                            className="mt-3 w-full rounded-lg bg-black py-2 text-xs font-semibold text-white transition-colors hover:bg-primary hover:text-black"
                          >
                            Book Now
                          </button>
                        )}
                        {full && (
                          <div className="mt-3 w-full rounded-lg bg-black/10 py-2 text-center text-xs font-medium text-black/40">
                            Unavailable
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
