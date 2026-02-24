'use client';

import { useState } from 'react';
import { createLocation, updateLocation } from '@/lib/actions/crud';

interface Court {
  courtType: 'clay' | 'mini';
  timing: string;
  availableSlots: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
}

interface LocationFormProps {
  location?: {
    id: number | string;
    name: string;
    slug: string;
    address: string;
    courts: Court[];
  };
}

const emptyCourt: Court = { courtType: 'clay', timing: '', availableSlots: 0, level: 'all' };

export function LocationForm({ location }: LocationFormProps) {
  const isEdit = !!location;
  const [courts, setCourts] = useState<Court[]>(location?.courts || [{ ...emptyCourt }]);

  const addCourt = () => setCourts([...courts, { ...emptyCourt }]);
  const removeCourt = (idx: number) => setCourts(courts.filter((_, i) => i !== idx));
  const updateCourt = (idx: number, field: keyof Court, value: string | number) => {
    const updated = [...courts];
    (updated[idx] as Record<string, unknown>)[field] = value;
    setCourts(updated);
  };

  const handleSubmit = async (formData: FormData) => {
    formData.set('courts', JSON.stringify(courts));
    if (isEdit) {
      await updateLocation(location.id, formData);
    } else {
      await createLocation(formData);
    }
  };

  return (
    <form action={handleSubmit} className="flex max-w-2xl flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
        <input id="name" name="name" type="text" required defaultValue={location?.name}
          className="h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="slug" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Slug</label>
        <input id="slug" name="slug" type="text" required defaultValue={location?.slug}
          className="h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="address" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Address</label>
        <textarea id="address" name="address" required rows={2} defaultValue={location?.address}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
      </div>

      <div className="mt-2">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Courts</p>
          <button type="button" onClick={addCourt}
            className="rounded-md bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
            + Add Court
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {courts.map((court, idx) => (
            <div key={idx} className="flex flex-wrap items-end gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500">Type</label>
                <select value={court.courtType} onChange={(e) => updateCourt(idx, 'courtType', e.target.value)}
                  className="h-9 rounded-md border border-zinc-300 px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
                  <option value="clay">Clay</option>
                  <option value="mini">Mini</option>
                </select>
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-xs text-zinc-500">Timing</label>
                <input value={court.timing} onChange={(e) => updateCourt(idx, 'timing', e.target.value)}
                  placeholder="e.g. 6:00 AM - 10:00 AM" required
                  className="h-9 rounded-md border border-zinc-300 px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500">Slots</label>
                <input type="number" min={0} value={court.availableSlots}
                  onChange={(e) => updateCourt(idx, 'availableSlots', Number(e.target.value))} required
                  className="h-9 w-20 rounded-md border border-zinc-300 px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-500">Level</label>
                <select value={court.level} onChange={(e) => updateCourt(idx, 'level', e.target.value)}
                  className="h-9 rounded-md border border-zinc-300 px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="all">All Levels</option>
                </select>
              </div>
              {courts.length > 1 && (
                <button type="button" onClick={() => removeCourt(idx)}
                  className="h-9 rounded-md border border-red-300 px-2 text-xs text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400">
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <button type="submit"
        className="mt-4 h-10 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700">
        {isEdit ? 'Update Location' : 'Create Location'}
      </button>
    </form>
  );
}
