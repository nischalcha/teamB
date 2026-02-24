import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload';
import { isAdmin, isPublicRead } from '@/lib/access';

const calculateAge = (birthday: string): number => {
  const birth = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const syncAge: CollectionBeforeChangeHook = ({ data }) => {
  if (data?.birthday) {
    data.age = calculateAge(data.birthday);
  }
  return data;
};

export const Players: CollectionConfig = {
  slug: 'players',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: isPublicRead,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [syncAge],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'birthday',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy-MM-dd',
        },
      },
    },
    {
      name: 'age',
      type: 'number',
      required: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Auto-calculated from birthday',
      },
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'achievements',
      type: 'richText',
    },
  ],
};
