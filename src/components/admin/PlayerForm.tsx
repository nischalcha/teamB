'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createPlayer, updatePlayer } from '@/lib/actions/crud';

interface PlayerFormProps {
  player?: {
    id: number | string;
    name: string;
    slug: string;
    birthday: string;
    profileImage?: { id: number; url: string } | null;
  };
}

export function PlayerForm({ player }: PlayerFormProps) {
  const isEdit = !!player;
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    if (isEdit) {
      await updatePlayer(player.id, formData);
    } else {
      await createPlayer(formData);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const inputClass = 'h-10 rounded-lg border border-black/20 bg-white px-3 text-sm text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';

  return (
    <form action={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-black">Name</label>
        <input id="name" name="name" type="text" required defaultValue={player?.name} className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="slug" className="text-sm font-medium text-black">Slug</label>
        <input id="slug" name="slug" type="text" required defaultValue={player?.slug} className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="birthday" className="text-sm font-medium text-black">Birthday</label>
        <input id="birthday" name="birthday" type="date" required defaultValue={player?.birthday?.split('T')[0]} className={inputClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="profileImage" className="text-sm font-medium text-black">Profile Image</label>
        {(preview || player?.profileImage) && (
          <div className="relative h-32 w-32 overflow-hidden rounded-full border border-black/20">
            <Image
              src={preview || player!.profileImage!.url}
              alt="Profile preview"
              fill
              className="object-cover"
            />
          </div>
        )}
        <input
          id="profileImage"
          name="profileImage"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-sm text-black/70 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/20 file:px-4 file:py-2 file:text-sm file:font-medium file:text-black hover:file:bg-primary/30"
        />
      </div>

      <button type="submit"
        className="mt-2 h-10 rounded-lg bg-black text-sm font-semibold text-white transition-colors hover:bg-primary hover:text-black">
        {isEdit ? 'Update Player' : 'Create Player'}
      </button>
    </form>
  );
}
