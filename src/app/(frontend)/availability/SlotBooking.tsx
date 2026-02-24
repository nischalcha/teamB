'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { bookSlotAction, getBookingsForDate } from '@/lib/actions/slot-booking';
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

  function handleBook(courtType: string, timeSlot: string) {
    if (!isLoggedIn) return;
    setMessage(null);

    const fd = new FormData();
    fd.set('locationId', String(active.id));
    fd.set('courtType', courtType);
    fd.set('date', selectedDate);
    fd.set('timeSlot', timeSlot);

    startTransition(async () => {
      const result = await bookSlotAction(fd);
      setMessage({ text: result.message, success: result.success });
      if (result.success) {
        const counts = await getBookingsForDate(active.id, selectedDate);
        setBookingCounts(counts);
      }
    });
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
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
        <span className="text-sm text-black/50">
          {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
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

      {/* Not logged in banner */}
      {!isLoggedIn && (
        <div className="mt-4 rounded-lg border border-black/10 bg-black/5 px-4 py-3 text-sm text-black/70">
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>{' '}
          to book a court slot.
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
                        {!full && isLoggedIn && (
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleBook(ct, slot)}
                            className="mt-3 w-full rounded-lg bg-black py-2 text-xs font-semibold text-white transition-colors hover:bg-primary hover:text-black disabled:opacity-50"
                          >
                            {isPending ? 'Booking...' : 'Book Now'}
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
