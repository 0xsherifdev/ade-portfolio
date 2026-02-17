import type { GlobalConfig } from 'payload'

export const Home: GlobalConfig = {
  slug: 'home',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'topText',
          type: 'text',
          defaultValue: 'Web3 Developer',
        },
        {
          name: 'headline',
          type: 'richText',
        },
        {
          name: 'subheadline',
          type: 'textarea',
        },
        {
          name: 'buttons',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
            },
            {
              name: 'link',
              type: 'text',
            },
            {
              name: 'style',
              type: 'select',
              options: ['primary', 'outline'],
              defaultValue: 'primary',
            },
          ],
        },
      ],
    },
    {
      name: 'about',
      type: 'group',
      fields: [
        {
            name: 'title',
            type: 'text',
            defaultValue: 'About',
        },
        {
          name: 'content',
          type: 'richText',
        },
        {
          name: 'stats',
          type: 'array',
          fields: [
            {
              name: 'number',
              type: 'text',
            },
            {
              name: 'label',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
        name: 'skills',
        type: 'group',
        fields: [
            {
                name: 'title',
                type: 'text',
                defaultValue: 'Tech Stack',
            },
            {
                name: 'categories',
                type: 'array',
                fields: [
                    {
                        name: 'category',
                        type: 'text',
                    },
                    {
                        name: 'items',
                        type: 'relationship',
                        relationTo: 'technologies',
                        hasMany: true,
                    },
                ],
            },
        ],
    },
    {
        name: 'projects',
        type: 'group',
        fields: [
            {
                name: 'title',
                type: 'text',
                defaultValue: 'Featured Projects',
            },
            {
                name: 'description',
                type: 'textarea',
                defaultValue: 'A collection of my work in blockchain, AI, and full-stack development.',
            },
        ]
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
            name: 'title',
            type: 'text',
            defaultValue: 'Contact',
        },
        {
          name: 'heading',
          type: 'text',
          defaultValue: "Let's build something together",
        },
        {
          name: 'content',
          type: 'textarea',
        },
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'socialLinks',
          type: 'array',
          fields: [
            {
              name: 'platform',
              type: 'text',
            },
            {
              name: 'url',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
}
