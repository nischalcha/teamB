import Link from 'next/link';
import { IoIosFlash } from 'react-icons/io';
import { RegisterForm } from './RegisterForm';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Register | Flash Sports Academy',
};

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(user.role === 'admin' ? '/admin-portal' : '/dashboard');
  }

  return (
    <div className="w-full max-w-md px-4">
      <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2">
            <IoIosFlash className="h-7 w-7 text-primary" />
            <h1 className="font-heading text-3xl font-bold uppercase tracking-tight text-black">
              Flash Sports
            </h1>
          </div>
          <p className="mt-2 text-sm text-black/50">
            Create your account
          </p>
        </div>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-black/50">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-black hover:text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
