import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Ade | Web3 Developer',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: "I'm Ade — a full-stack blockchain developer specializing in smart contracts, DeFi protocols, and AI-powered Web3 applications. Turning ideas into production-ready code.",
    },
    {
      name: 'logoText',
      type: 'text',
      defaultValue: 'ade.dev',
    },
    {
      name: 'footerText',
      type: 'text',
    },
    {
        name: 'navItems',
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
        ],
    },
  ],
}
