import Link from 'next/link';
import { LoginForm } from './LoginForm';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Login | Flash Sports Academy',
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(user.role === 'admin' ? '/admin-portal' : '/dashboard');
  }

  return (
    <div className="w-full max-w-md px-4">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-emerald-600">Flash Sports</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to your account
          </p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
