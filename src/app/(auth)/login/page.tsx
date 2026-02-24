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
      <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-primary">Flash Sports</h1>
          <p className="mt-2 text-sm text-black/50">
            Sign in to your account
          </p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-black/50">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-black hover:text-primary">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
