import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'featured'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'tech',
      type: 'relationship',
      relationTo: 'technologies',
      hasMany: true,
    },
    {
      name: 'links',
      type: 'group',
      fields: [
        {
          name: 'code',
          type: 'text',
        },
        {
          name: 'demo',
          type: 'text',
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'icon',
      type: 'text',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'client',
      type: 'text',
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'serviceType',
      type: 'text',
    },
    {
      name: 'overview',
      type: 'richText',
    },
    {
      name: 'process',
      type: 'array',
      fields: [
        {
          name: 'step',
          type: 'text',
        },
      ],
    },
    {
      name: 'results',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'value',
          type: 'text',
        },
      ],
    },
    {
      name: 'testimonial',
      type: 'group',
      fields: [
        {
          name: 'content',
          type: 'textarea',
        },
        {
          name: 'author',
          type: 'text',
        },
        {
          name: 'role',
          type: 'text',
        },
      ],
    },
    {
      name: 'finalThoughts',
      type: 'textarea',
    },
  ],
}
