'use server';

import { getPayload } from 'payload';
import config from '@payload-config';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface AuthResult {
  success: boolean;
  error?: string;
}

export async function loginAction(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  try {
    const payload = await getPayload({ config });
    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    });

    if (result.token) {
      const cookieStore = await cookies();
      cookieStore.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
      });

      const role = (result.user as Record<string, unknown>).role as string;
      if (role === 'admin') {
        redirect('/admin-portal');
      } else {
        redirect('/dashboard');
      }
    }

    return { success: false, error: 'Invalid credentials.' };
  } catch (error) {
    if (error instanceof Error && 'digest' in error) {
      throw error;
    }
    return { success: false, error: 'Invalid email or password.' };
  }
}

export async function registerAction(formData: FormData): Promise<AuthResult> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!name || !email || !password) {
    return { success: false, error: 'All fields are required.' };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match.' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  try {
    const payload = await getPayload({ config });

    await payload.create({
      collection: 'users',
      data: {
        name,
        email,
        password,
        role: 'user',
      },
    });

    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    });

    if (result.token) {
      const cookieStore = await cookies();
      cookieStore.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
      });

      redirect('/dashboard');
    }

    return { success: false, error: 'Registration succeeded but login failed.' };
  } catch (error) {
    if (error instanceof Error && 'digest' in error) {
      throw error;
    }
    const message = error instanceof Error ? error.message : 'Registration failed.';
    if (message.includes('duplicate') || message.includes('unique')) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    return { success: false, error: message };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('payload-token');
  redirect('/login');
}
