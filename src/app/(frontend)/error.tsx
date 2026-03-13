'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Route error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">
      <h1 className="text-2xl font-bold text-black">Something went wrong</h1>
      <p className="mt-2 max-w-md text-black/60">
        We couldn’t load this page. This can happen if the database is temporarily unavailable.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <button
          onClick={reset}
          className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black/80"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-black/20 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-black/5"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
