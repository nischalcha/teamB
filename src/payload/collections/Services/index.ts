import type { CollectionConfig } from 'payload';
import { isAdmin, isPublicRead } from '@/lib/access';

export const Services: CollectionConfig = {
  slug: 'services',
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
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Adults', value: 'adults' },
        { label: 'Kids', value: 'kids' },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'pricingUnit',
      type: 'select',
      required: true,
      options: [
        { label: 'Per Month', value: 'month' },
        { label: 'Per Hour', value: 'hour' },
      ],
    },
    {
      name: 'timing',
      type: 'select',
      required: true,
      options: [
        { label: 'Morning', value: 'morning' },
        { label: 'Evening', value: 'evening' },
      ],
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'richText',
    },
  ],
};
