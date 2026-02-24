'use client';

import { useState, useTransition, useCallback, useRef } from 'react';
import { cancelBookingAction } from '@/lib/actions/slot-booking';

interface CancelButtonProps {
  bookingId: number | string;
}

export function CancelButton({ bookingId }: CancelButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const handleClose = useCallback(() => setShowConfirm(false), []);

  function handleCancel() {
    setError(null);
    startTransition(async () => {
      const result = await cancelBookingAction(bookingId);
      if (!result.success) {
        setError(result.message);
      } else {
        setShowConfirm(false);
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
      >
        Cancel
      </button>

      {showConfirm && (
        <div
          ref={overlayRef}
          onClick={(e) => {
            if (e.target === overlayRef.current) handleClose();
          }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <div className="relative mx-4 w-full max-w-sm animate-[modalIn_0.25s_ease-out] overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="h-1.5 w-full bg-red-500" />
            <div className="flex flex-col items-center px-8 pb-8 pt-10 text-center">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <svg className="h-7 w-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-bold uppercase italic tracking-tight text-black">
                Cancel Booking?
              </h3>
              <p className="mt-2 text-sm text-black/50">
                This action cannot be undone. Your slot will become available for others to book.
              </p>
              {error && (
                <p className="mt-3 text-sm text-red-600">{error}</p>
              )}
              <div className="mt-8 flex w-full gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex h-11 flex-1 items-center justify-center rounded-full border-2 border-black/15 text-sm font-semibold text-black transition-colors hover:bg-black/5"
                >
                  Keep It
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleCancel}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-red-600 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Cancelling…
                    </>
                  ) : (
                    'Yes, Cancel'
                  )}
                </button>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes modalIn {
              from { opacity: 0; transform: scale(0.95) translateY(8px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
