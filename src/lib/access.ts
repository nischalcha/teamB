import type { AccessArgs } from 'payload';

interface UserWithRole {
  role?: 'user' | 'admin';
}

export const isAdmin = ({ req }: AccessArgs): boolean => {
  return (req.user as UserWithRole | null)?.role === 'admin';
};

export const isAdminOrLoggedIn = ({ req }: AccessArgs): boolean => {
  if (!req.user) return false;
  return true;
};

export const isPublicRead = (): boolean => true;

export const isAdminFieldAccess = ({ req }: AccessArgs): boolean => {
  return (req.user as UserWithRole | null)?.role === 'admin';
};
