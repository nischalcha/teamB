'use client';

import { deleteDocument } from '@/lib/actions/crud';
import { useTransition } from 'react';

interface DeleteButtonProps {
  collection: 'players' | 'locations' | 'services' | 'events';
  id: number | string;
}

export function DeleteButton({ collection, id }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    startTransition(async () => {
      await deleteDocument(collection, id);
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-md border border-black/20 px-3 py-1 text-xs font-medium text-black/70 transition-colors hover:bg-black/5 disabled:opacity-50"
    >
      {isPending ? '...' : 'Delete'}
    </button>
  );
}
