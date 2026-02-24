import { headers as getHeaders } from 'next/headers';
import { getPayload } from 'payload';
import config from '@payload-config';

export type UserRole = 'user' | 'admin';

export interface AuthUser {
  id: number | string;
  email: string;
  name: string;
  role: UserRole;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const payload = await getPayload({ config });
    const headersList = await getHeaders();
    const { user } = await payload.auth({ headers: headersList });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: (user as Record<string, unknown>).name as string,
      role: ((user as Record<string, unknown>).role as UserRole) || 'user',
    };
  } catch {
    return null;
  }
}
