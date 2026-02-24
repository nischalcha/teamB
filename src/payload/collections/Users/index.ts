import type { AccessArgs, CollectionConfig } from 'payload';

type UserRole = 'user' | 'admin';

interface UserData {
  role?: UserRole;
}

const isAdmin = ({ req }: AccessArgs): boolean => {
  return (req.user as UserData | null)?.role === 'admin';
};

const isAdminOrSelf = ({ req }: AccessArgs): boolean => {
  if ((req.user as UserData | null)?.role === 'admin') return true;
  if (req.user) return true;
  return false;
};

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
  },
  auth: true,
  access: {
    read: isAdminOrSelf,
    create: () => true,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      options: [
        { label: 'User', value: 'user' },
        { label: 'Admin', value: 'admin' },
      ],
      access: {
        update: isAdmin,
      },
      admin: {
        description: 'Only admins can change user roles.',
      },
    },
  ],
};
