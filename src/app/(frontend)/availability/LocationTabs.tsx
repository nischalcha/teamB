'use client';

import { useState } from 'react';

interface Court {
  courtType: 'clay' | 'mini';
  timing: string;
  availableSlots: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  id?: string;
}

interface LocationData {
  id: number | string;
  name: string;
  slug: string;
  courts: Court[];
}

const LEVEL_LABELS: Record<Court['level'], string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  all: 'All Levels',
};

const COURT_TYPE_LABELS: Record<Court['courtType'], string> = {
  clay: 'Clay',
  mini: 'Mini',
};

export function LocationTabs({ locations }: { locations: LocationData[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = locations[activeIndex];

  return (
    <div>
      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-700">
        {locations.map((loc, idx) => (
          <button
            key={loc.id}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              idx === activeIndex
                ? 'border-b-2 border-emerald-600 text-emerald-600'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
            }`}
          >
            {loc.name}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto">
        {active.courts.length === 0 ? (
          <p className="py-8 text-center text-zinc-500 dark:text-zinc-400">
            No courts configured for this location yet.
          </p>
        ) : (
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="pb-3 pr-4 font-semibold text-zinc-900 dark:text-zinc-50">
                  Court Type
                </th>
                <th className="pb-3 pr-4 font-semibold text-zinc-900 dark:text-zinc-50">
                  Timing
                </th>
                <th className="pb-3 pr-4 font-semibold text-zinc-900 dark:text-zinc-50">
                  Available Slots
                </th>
                <th className="pb-3 font-semibold text-zinc-900 dark:text-zinc-50">
                  Level
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {active.courts.map((court, idx) => (
                <tr key={court.id ?? idx}>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        court.courtType === 'clay'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}
                    >
                      {COURT_TYPE_LABELS[court.courtType]}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-zinc-700 dark:text-zinc-300">
                    {court.timing}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`font-semibold ${
                        court.availableSlots > 0
                          ? 'text-emerald-600'
                          : 'text-red-500'
                      }`}
                    >
                      {court.availableSlots}
                    </span>
                  </td>
                  <td className="py-3 text-zinc-700 dark:text-zinc-300">
                    {LEVEL_LABELS[court.level]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
