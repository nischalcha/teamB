'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

interface AgeFilterProps {
  currentMin?: number;
  currentMax?: number;
}

export function AgeFilter({ currentMin, currentMax }: AgeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [minAge, setMinAge] = useState(currentMin?.toString() ?? '');
  const [maxAge, setMaxAge] = useState(currentMax?.toString() ?? '');

  const applyFilter = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (minAge) {
      params.set('minAge', minAge);
    } else {
      params.delete('minAge');
    }

    if (maxAge) {
      params.set('maxAge', maxAge);
    } else {
      params.delete('maxAge');
    }

    const qs = params.toString();
    router.push(qs ? `/players?${qs}` : '/players');
  }, [minAge, maxAge, router, searchParams]);

  const clearFilter = useCallback(() => {
    setMinAge('');
    setMaxAge('');
    router.push('/players');
  }, [router]);

  return (
    <div className="flex flex-wrap items-end gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-1">
        <label htmlFor="minAge" className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Min Age
        </label>
        <input
          id="minAge"
          type="number"
          min={0}
          placeholder="e.g. 10"
          value={minAge}
          onChange={(e) => setMinAge(e.target.value)}
          className="h-9 w-24 rounded-md border border-zinc-300 bg-transparent px-3 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:text-zinc-100"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="maxAge" className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Max Age
        </label>
        <input
          id="maxAge"
          type="number"
          min={0}
          placeholder="e.g. 18"
          value={maxAge}
          onChange={(e) => setMaxAge(e.target.value)}
          className="h-9 w-24 rounded-md border border-zinc-300 bg-transparent px-3 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:text-zinc-100"
        />
      </div>
      <button
        type="button"
        onClick={applyFilter}
        className="h-9 rounded-md bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
      >
        Filter
      </button>
      {(currentMin !== undefined || currentMax !== undefined) && (
        <button
          type="button"
          onClick={clearFilter}
          className="h-9 rounded-md border border-zinc-300 px-4 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Clear
        </button>
      )}
    </div>
  );
}
