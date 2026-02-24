'use client';

import { useActionState } from 'react';
import { submitBookingAction, type BookingResult } from '@/lib/actions/booking';

interface LocationOption {
  id: number | string;
  name: string;
}

interface BookingFormProps {
  locations: LocationOption[];
}

const initialState: BookingResult = { success: false, message: '' };

export function BookingForm({ locations }: BookingFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: BookingResult, formData: FormData) => {
      return await submitBookingAction(formData);
    },
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            state.success
              ? 'bg-primary/20 text-black'
              : state.message
                ? 'bg-black/5 text-black'
                : ''
          }`}
        >
          {state.message}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="location" className="text-sm font-medium text-black">
            Location *
          </label>
          <select
            id="location"
            name="location"
            required
            className="h-10 rounded-lg border border-black/20 bg-white px-3 text-sm text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select location</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="courtType" className="text-sm font-medium text-black">
            Court Type *
          </label>
          <select
            id="courtType"
            name="courtType"
            required
            className="h-10 rounded-lg border border-black/20 bg-white px-3 text-sm text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select court type</option>
            <option value="clay">Clay Court</option>
            <option value="mini">Mini Court</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="preferredDate" className="text-sm font-medium text-black">
            Preferred Date *
          </label>
          <input
            id="preferredDate"
            name="preferredDate"
            type="date"
            required
            min={new Date().toISOString().split('T')[0]}
            className="h-10 rounded-lg border border-black/20 bg-white px-3 text-sm text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="preferredTime" className="text-sm font-medium text-black">
            Preferred Time *
          </label>
          <select
            id="preferredTime"
            name="preferredTime"
            required
            className="h-10 rounded-lg border border-black/20 bg-white px-3 text-sm text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select time</option>
            <option value="6:00 AM - 7:00 AM">6:00 AM - 7:00 AM</option>
            <option value="7:00 AM - 8:00 AM">7:00 AM - 8:00 AM</option>
            <option value="8:00 AM - 9:00 AM">8:00 AM - 9:00 AM</option>
            <option value="9:00 AM - 10:00 AM">9:00 AM - 10:00 AM</option>
            <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
            <option value="4:00 PM - 5:00 PM">4:00 PM - 5:00 PM</option>
            <option value="5:00 PM - 6:00 PM">5:00 PM - 6:00 PM</option>
            <option value="6:00 PM - 7:00 PM">6:00 PM - 7:00 PM</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="level" className="text-sm font-medium text-black">
          Skill Level
        </label>
        <select
          id="level"
          name="level"
          className="h-10 rounded-lg border border-black/20 bg-white px-3 text-sm text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Select level (optional)</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-sm font-medium text-black">
          Additional Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Any special requests or information..."
          className="rounded-lg border border-black/20 bg-white px-3 py-2 text-sm text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="h-11 rounded-lg bg-black text-sm font-semibold text-white transition-colors hover:bg-primary hover:text-black disabled:opacity-50"
      >
        {isPending ? 'Sending booking request...' : 'Book Court'}
      </button>
    </form>
  );
}
