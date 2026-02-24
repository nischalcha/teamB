import type { AccessArgs, CollectionConfig } from 'payload';

const isAdminOrOwner = ({ req }: AccessArgs): boolean | object => {
  if (!req.user) return false;
  if ((req.user as Record<string, unknown>).role === 'admin') return true;
  return { user: { equals: req.user.id } };
};

const isAdmin = ({ req }: AccessArgs): boolean => {
  return (req.user as Record<string, unknown> | null)?.role === 'admin';
};

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'timeSlot',
  },
  access: {
    read: isAdminOrOwner,
    create: ({ req }) => !!req.user,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'userName',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'userEmail',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      required: true,
    },
    {
      name: 'courtType',
      type: 'select',
      required: true,
      options: [
        { label: 'Clay Court', value: 'clay' },
        { label: 'Mini Court', value: 'mini' },
      ],
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      index: true,
    },
    {
      name: 'timeSlot',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'confirmed',
      options: [
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
  ],
};
