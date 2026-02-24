'use client';

import { createPlayer, updatePlayer } from '@/lib/actions/crud';

interface PlayerFormProps {
  player?: {
    id: number | string;
    name: string;
    slug: string;
    birthday: string;
  };
}

export function PlayerForm({ player }: PlayerFormProps) {
  const isEdit = !!player;

  const handleSubmit = async (formData: FormData) => {
    if (isEdit) {
      await updatePlayer(player.id, formData);
    } else {
      await createPlayer(formData);
    }
  };

  return (
    <form action={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
        <input id="name" name="name" type="text" required defaultValue={player?.name}
          className="h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="slug" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Slug</label>
        <input id="slug" name="slug" type="text" required defaultValue={player?.slug}
          className="h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="birthday" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Birthday</label>
        <input id="birthday" name="birthday" type="date" required defaultValue={player?.birthday?.split('T')[0]}
          className="h-10 rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
      </div>
      <button type="submit"
        className="mt-2 h-10 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700">
        {isEdit ? 'Update Player' : 'Create Player'}
      </button>
    </form>
  );
}
