import { cookies, headers as getHeaders } from 'next/headers';
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
    const cookieStore = await cookies();

    // In production, Payload's cookie strategy can fail (Origin/csrf). Pass token explicitly.
    const token = cookieStore.get('payload-token')?.value;
    const authHeaders = new Headers(headersList);
    if (token) {
      authHeaders.set('Authorization', `JWT ${token}`);
    }

    const { user } = await payload.auth({ headers: authHeaders });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email ?? '',
      name: (user as Record<string, unknown>).name as string,
      role: ((user as Record<string, unknown>).role as UserRole) || 'user',
    };
  } catch {
    return null;
  }
}
