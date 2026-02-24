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
      className="rounded-md border border-red-300 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
    >
      {isPending ? '...' : 'Delete'}
    </button>
  );
}
