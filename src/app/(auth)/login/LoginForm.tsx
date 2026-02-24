'use client';

import { useActionState } from 'react';
import { loginAction } from '@/lib/actions/auth';

interface FormState {
  success: boolean;
  error?: string;
}

const initialState: FormState = { success: false };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: FormState, formData: FormData) => {
      const result = await loginAction(formData);
      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <div className="rounded-lg bg-black/5 px-4 py-3 text-sm text-black">
          {state.error}
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-black">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-10 rounded-lg border border-black/20 bg-transparent px-3 text-sm text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-black">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-10 rounded-lg border border-black/20 bg-transparent px-3 text-sm text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="mt-2 h-10 rounded-lg bg-black text-sm font-semibold text-white transition-colors hover:bg-primary hover:text-black disabled:opacity-50"
      >
        {isPending ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
