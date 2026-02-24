import type { CollectionConfig } from 'payload';
import { isAdmin, isPublicRead } from '@/lib/access';

export const Locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: isPublicRead,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
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
      name: 'address',
      type: 'textarea',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'courts',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'courtType',
          type: 'select',
          required: true,
          options: [
            { label: 'Clay', value: 'clay' },
            { label: 'Mini', value: 'mini' },
          ],
        },
        {
          name: 'timing',
          type: 'text',
          required: true,
        },
        {
          name: 'availableSlots',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'level',
          type: 'select',
          required: true,
          options: [
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' },
            { label: 'All Levels', value: 'all' },
          ],
        },
      ],
    },
  ],
};
