'use client';

import { createEvent, updateEvent } from '@/lib/actions/crud';

interface LocationOption {
  id: number | string;
  name: string;
}

interface EventFormProps {
  locations: LocationOption[];
  event?: {
    id: number | string;
    title: string;
    slug: string;
    startDate: string;
    endDate: string;
    timing: string;
    location: number | string;
  };
}

export function EventForm({ locations, event }: EventFormProps) {
  const isEdit = !!event;

  const handleSubmit = async (formData: FormData) => {
    if (isEdit) {
      await updateEvent(event.id, formData);
    } else {
      await createEvent(formData);
    }
  };

  return (
    <form action={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Title</label>
        <input id="title" name="title" type="text" required defaultValue={event?.title}
          className="h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="slug" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Slug</label>
        <input id="slug" name="slug" type="text" required defaultValue={event?.slug}
          className="h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="startDate" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Start Date</label>
          <input id="startDate" name="startDate" type="date" required defaultValue={event?.startDate?.split('T')[0]}
            className="h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="endDate" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">End Date</label>
          <input id="endDate" name="endDate" type="date" required defaultValue={event?.endDate?.split('T')[0]}
            className="h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="timing" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Timing</label>
        <input id="timing" name="timing" type="text" placeholder="e.g. 9:00 AM - 5:00 PM" defaultValue={event?.timing}
          className="h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="location" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Location</label>
        <select id="location" name="location" required defaultValue={event?.location}
          className="h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
          <option value="">Select a location</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>
      </div>
      <button type="submit"
        className="mt-2 h-10 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700">
        {isEdit ? 'Update Event' : 'Create Event'}
      </button>
    </form>
  );
}
