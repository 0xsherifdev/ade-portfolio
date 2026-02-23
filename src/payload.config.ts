import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import sharp from 'sharp'

import { Users } from './payload/collections/Users'
import { Media } from './payload/collections/Media'
import { Projects } from './payload/collections/Projects'
import { Technologies } from './payload/collections/Technologies'
import { Home } from './payload/globals/Home'
import { SiteSettings } from './payload/globals/SiteSettings'

export default buildConfig({
  admin: {
    user: Users.slug,
    livePreview: {
      url: ({ data, collectionConfig, globalConfig }) => {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        if (globalConfig?.slug === 'home') return baseUrl
        if (collectionConfig?.slug === 'projects' && data?.slug) return `${baseUrl}/projects/${data.slug}`
        return baseUrl
      },
      globals: ['home'],
      collections: ['projects'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [
    Users,
    Media,
    Projects,
    Technologies,
  ],
  globals: [
    Home,
    SiteSettings,
  ],
  plugins: [
    ...(process.env.VERCEL === '1' ? [vercelBlobStorage({
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      collections: {
        media: true,
      },
    })] : []),
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'YOUR_SECRET_HERE',
  typescript: {
    outputFile: path.resolve(process.cwd(), 'src/payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://localhost/ade-portfolio',
  }),
  sharp,
})
