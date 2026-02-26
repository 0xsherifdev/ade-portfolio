#!/usr/bin/env npx tsx
/**
 * Directus setup script
 * Creates all collections, fields, relations, and seeds initial data.
 *
 * Usage:
 *   npm run directus:setup
 *
 * Reads env from .env.local (or process.env):
 *   DIRECTUS_URL              → defaults to http://localhost:8055
 *   DIRECTUS_TOKEN            → static admin token (preferred)
 *   DIRECTUS_ADMIN_EMAIL      → fallback auth (defaults to admin@example.com)
 *   DIRECTUS_ADMIN_PASSWORD   → fallback auth (defaults to change-me)
 *
 * Re-run safe — existing collections/fields are skipped.
 */

import { projects as hardcodedProjects } from '../src/data/projects'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// ─── Load .env.local ──────────────────────────────────────────────────────────
try {
  const env = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
  for (const line of env.split('\n')) {
    const [key, ...rest] = line.split('=')
    if (key && !key.startsWith('#') && rest.length) {
      process.env[key.trim()] ??= rest.join('=').trim()
    }
  }
} catch { /* .env.local not present — use process.env as-is */ }

// ─── Config ───────────────────────────────────────────────────────────────────
const BASE = (process.env.DIRECTUS_URL ?? 'http://localhost:8055').replace(/\/$/, '')
const STATIC_TOKEN = process.env.DIRECTUS_TOKEN
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL ?? 'admin@example.com'
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD ?? 'change-me'

// ─── Auth ─────────────────────────────────────────────────────────────────────
async function getToken(): Promise<string> {
  if (STATIC_TOKEN) return STATIC_TOKEN
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`Auth failed: ${json.errors?.[0]?.message ?? res.status}`)
  return json.data.access_token
}

// ─── API helper ───────────────────────────────────────────────────────────────
let TOKEN: string

async function api<T = unknown>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const json: any = await res.json()
  if (!res.ok) {
    throw Object.assign(
      new Error(json.errors?.[0]?.message ?? `HTTP ${res.status}`),
      { status: res.status, json },
    )
  }
  return json.data ?? json
}

// Ignore errors whose message contains any of the given strings
async function safe(fn: () => Promise<unknown>, ...ignore: string[]) {
  try {
    await fn()
  } catch (e: any) {
    const msg: string = (e.message ?? '').toLowerCase()
    if (ignore.some((s) => msg.includes(s.toLowerCase()))) return
    throw e
  }
}

const SKIP = [
  'already exists',
  'duplicate',
  'record_not_unique',
  'already has an associated relationship',
]

// ─── Logging ──────────────────────────────────────────────────────────────────
const log = {
  step: (s: string) => console.log(`\n── ${s} ${'─'.repeat(Math.max(0, 40 - s.length))}`),
  ok:   (s: string) => console.log(`  ✓ ${s}`),
  skip: (s: string) => console.log(`  · ${s} (skipped)`),
  warn: (s: string) => console.log(`  ⚠ ${s}`),
}

// ─── Schema helpers ───────────────────────────────────────────────────────────
async function createCollection(collection: string, meta: Record<string, unknown> = {}) {
  await safe(
    () => api('POST', '/collections', { collection, meta: { icon: 'box', ...meta }, schema: {} }),
    ...SKIP,
  )
  log.ok(`Collection: ${collection}`)
}

async function createField(
  collection: string,
  field: string,
  type: string,
  meta: Record<string, unknown> = {},
  schema: Record<string, unknown> = {},
) {
  try {
    await api('POST', `/fields/${collection}`, { field, type, meta, schema })
  } catch (e: any) {
    const msg = (e.message ?? '').toLowerCase()
    if (SKIP.some((s) => msg.includes(s.toLowerCase()))) {
      // Field exists — update its meta so interface/options are always in sync
      await api('PATCH', `/fields/${collection}/${field}`, { meta })
    } else {
      throw e
    }
  }
  log.ok(`  field: ${field}`)
}

async function createRelation(payload: Record<string, unknown>) {
  await safe(() => api('POST', '/relations', payload), ...SKIP)
}

// ─── Repeater field builder ───────────────────────────────────────────────────
// Renders a proper form in the Directus admin UI instead of a raw JSON textarea.
// Each sub-field definition follows the Directus field meta shape.
type SubField = {
  field: string
  name: string
  type: string
  meta: Record<string, unknown>
}

function repeater(subFields: SubField[]): Record<string, unknown> {
  return {
    interface: 'list',
    special: ['cast-json'],
    options: { fields: subFields },
    note: null, // clear any old helper text left from previous runs
  }
}

// ─── Common sub-field shapes ──────────────────────────────────────────────────
const input = (field: string, name: string, width = 'full'): SubField => ({
  field, name, type: 'string', meta: { interface: 'input', width },
})

const textarea = (field: string, name: string): SubField => ({
  field, name, type: 'text', meta: { interface: 'input-multiline', width: 'full' },
})

const dropdown = (field: string, name: string, choices: { text: string; value: string }[]): SubField => ({
  field, name, type: 'string',
  meta: { interface: 'select-dropdown', width: 'half', options: { choices } },
})

const tags = (field: string, name: string): SubField => ({
  field, name, type: 'json', meta: { interface: 'tags', width: 'full' },
})

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\nConnecting to ${BASE} …`)
  TOKEN = await getToken()
  await api('GET', '/users/me')
  console.log('  ✓ Authenticated')

  // ── 1. technologies ──────────────────────────────────────────────────────
  log.step('technologies')
  await createCollection('technologies', { display_template: '{{name}}' })
  await createField('technologies', 'name', 'string', { interface: 'input', required: true })
  await createField('technologies', 'slug', 'string', { interface: 'input', note: 'URL-safe, e.g. react' }, { is_unique: true })
  await createField('technologies', 'icon', 'string', { interface: 'input', note: 'Optional emoji or CSS class' })

  // ── 2. projects ──────────────────────────────────────────────────────────
  log.step('projects')
  await createCollection('projects', { display_template: '{{title}}' })

  await createField('projects', 'title',               'string',  { interface: 'input', required: true })
  await createField('projects', 'slug',                'string',  { interface: 'input' }, { is_unique: true })
  await createField('projects', 'subtitle',            'string',  { interface: 'input' })
  await createField('projects', 'description',         'text',    { interface: 'textarea', required: true })
  await createField('projects', 'featured',            'boolean', { interface: 'toggle', default_value: false })
  await createField('projects', 'icon',                'string',  { interface: 'input', note: 'Emoji, e.g. 🎮' })
  await createField('projects', 'image',               'uuid',    { interface: 'file-image', special: ['file'] })
  // Relation required for inline upload in the admin UI
  await createRelation({ collection: 'projects', field: 'image', related_collection: 'directus_files' })
  await createField('projects', 'client',              'string',  { interface: 'input' })
  await createField('projects', 'location',            'string',  { interface: 'input' })
  await createField('projects', 'service_type',        'string',  { interface: 'input' })
  await createField('projects', 'link_code',           'string',  { interface: 'input', options: { placeholder: 'https://github.com/…' } })
  await createField('projects', 'link_demo',           'string',  { interface: 'input', options: { placeholder: 'https://…' } })
  await createField('projects', 'overview',            'text',    { interface: 'input-rich-text-html' })
  await createField('projects', 'final_thoughts',      'text',    { interface: 'textarea' })
  await createField('projects', 'testimonial_content', 'text',    { interface: 'textarea' })
  await createField('projects', 'testimonial_author',  'string',  { interface: 'input', width: 'half' })
  await createField('projects', 'testimonial_role',    'string',  { interface: 'input', width: 'half' })

  // Repeater: process steps — each row is a single text field
  await createField('projects', 'process', 'json', repeater([
    textarea('step', 'Step'),
  ]))

  // Repeater: results — label + value pairs
  await createField('projects', 'results', 'json', repeater([
    input('value', 'Value', 'half'),
    input('label', 'Label', 'half'),
  ]))

  // ── 3. M2M: projects ↔ technologies ──────────────────────────────────────
  log.step('M2M  projects.tech ↔ technologies')
  await createCollection('projects_technologies', { hidden: true, icon: 'import_export' })
  await createField('projects_technologies', 'projects_id',     'integer', { hidden: true })
  await createField('projects_technologies', 'technologies_id', 'integer', { hidden: true })
  // Register relations. one_field:'tech' links the relation back to the alias
  // field on projects so Directus knows they belong together.
  await createRelation({
    collection: 'projects_technologies', field: 'projects_id',
    related_collection: 'projects',
    meta: { one_field: 'tech', junction_field: 'technologies_id' },
    schema: { on_delete: 'SET NULL' },
  })
  await createRelation({
    collection: 'projects_technologies', field: 'technologies_id',
    related_collection: 'technologies',
    meta: { junction_field: 'projects_id' },
    schema: { on_delete: 'SET NULL' },
  })
  // Alias field — type:'alias' means NO SQL column is created; this is purely
  // a Directus UI concept that renders the M2M list-m2m interface on projects.
  await createField('projects', 'tech', 'alias', {
    interface: 'list-m2m',
    special: ['m2m'],
    options: { fields: ['technologies_id.name'] },
  })

  // ── 4. home singleton ─────────────────────────────────────────────────────
  log.step('home  (singleton)')
  await createCollection('home', { singleton: true, icon: 'home', display_template: 'Home Page' })

  // Hero
  await createField('home', 'hero_top_text',    'string', { interface: 'input', note: 'Small badge above headline, e.g. "Web3 Developer"' })
  await createField('home', 'hero_headline',    'string', { interface: 'input', note: 'Can contain <em> tags for accent colour' })
  await createField('home', 'hero_subheadline', 'text',   { interface: 'textarea' })
  // Repeater: hero buttons — label, link, style dropdown
  await createField('home', 'hero_buttons', 'json', repeater([
    input('label', 'Label', 'half'),
    input('link',  'Link',  'half'),
    dropdown('style', 'Style', [
      { text: 'Primary (filled)',  value: 'primary' },
      { text: 'Outline (ghost)',   value: 'outline'  },
    ]),
  ]))

  // About
  await createField('home', 'about_title',   'string', { interface: 'input' })
  await createField('home', 'about_content', 'text',   { interface: 'input-rich-text-html' })
  // Repeater: stats — number + label side by side
  await createField('home', 'about_stats', 'json', repeater([
    input('number', 'Number', 'half'),
    input('label',  'Label',  'half'),
  ]))

  // Skills
  await createField('home', 'skills_title', 'string', { interface: 'input' })
  // Repeater: skill categories — name + tags for items
  await createField('home', 'skills_categories', 'json', repeater([
    input('category', 'Category'),
    tags('items', 'Skills (press Enter after each)'),
  ]))

  // Projects section label
  await createField('home', 'projects_title', 'string', { interface: 'input' })

  // Contact
  await createField('home', 'contact_title',   'string', { interface: 'input' })
  await createField('home', 'contact_heading', 'string', { interface: 'input' })
  await createField('home', 'contact_content', 'text',   { interface: 'textarea' })
  await createField('home', 'contact_email',   'string', { interface: 'input', options: { placeholder: 'hello@you.dev' } })
  // Repeater: social links — platform + url
  await createField('home', 'contact_social_links', 'json', repeater([
    input('platform', 'Platform', 'half'),
    input('url',      'URL',      'half'),
  ]))

  // ── 5. site_settings singleton ────────────────────────────────────────────
  log.step('site_settings  (singleton)')
  await createCollection('site_settings', { singleton: true, icon: 'settings', display_template: 'Site Settings' })
  await createField('site_settings', 'title',       'string', { interface: 'input' })
  await createField('site_settings', 'description', 'text',   { interface: 'textarea' })
  await createField('site_settings', 'logo_text',   'string', { interface: 'input' })
  await createField('site_settings', 'footer_text', 'text',   { interface: 'textarea' })
  // Repeater: nav items
  await createField('site_settings', 'nav_items', 'json', repeater([
    input('label', 'Label', 'half'),
    input('href',  'Href',  'half'),
  ]))

  // ── 6. Public read access ─────────────────────────────────────────────────
  log.step('Public read access')
  await grantPublicReadAccess()

  // ── 7. Seed technologies ──────────────────────────────────────────────────
  log.step('Seed  technologies')
  const techList = [
    { name: 'Solidity',     slug: 'solidity'     },
    { name: 'React',        slug: 'react'        },
    { name: 'Next.js',      slug: 'nextjs'       },
    { name: 'TypeScript',   slug: 'typescript'   },
    { name: 'Node.js',      slug: 'nodejs'       },
    { name: 'PostgreSQL',   slug: 'postgresql'   },
    { name: 'Python',       slug: 'python'       },
    { name: 'Flask',        slug: 'flask'        },
    { name: 'IPFS',         slug: 'ipfs'         },
    { name: 'Ethers.js',    slug: 'ethersjs'     },
    { name: 'React Native', slug: 'react-native' },
    { name: 'Web3',         slug: 'web3'         },
    { name: 'Hardhat',      slug: 'hardhat'      },
    { name: 'Wagmi',        slug: 'wagmi'        },
    { name: 'MongoDB',      slug: 'mongodb'      },
    { name: 'Redis',        slug: 'redis'        },
    { name: 'TailwindCSS',  slug: 'tailwindcss'  },
  ]

  const techRes: any = await api('GET', '/items/technologies?fields=id,slug&limit=-1')
  const existingTech: any[] = Array.isArray(techRes) ? techRes : (techRes?.data ?? [])
  const techMap: Record<string, string> = {}
  for (const t of existingTech) techMap[t.slug] = t.id

  for (const tech of techList) {
    if (techMap[tech.slug]) { log.skip(`tech: ${tech.name}`); continue }
    const created: any = await api('POST', '/items/technologies', tech)
    techMap[tech.slug] = created.id
    log.ok(`tech: ${tech.name}`)
  }

  // ── 8. Seed home ─────────────────────────────────────────────────────────
  log.step('Seed  home singleton')
  const homePayload = {
    hero_top_text:    'Web3 Developer',
    hero_headline:    'Building the <em>decentralized</em> future',
    hero_subheadline: "I'm Ade — a full-stack blockchain developer specializing in smart contracts, DeFi protocols, and AI-powered Web3 applications. Turning ideas into production-ready code.",
    hero_buttons: [
      { label: 'View Projects →', link: '#projects', style: 'primary' },
      { label: 'Get in Touch',    link: '#contact',  style: 'outline'  },
    ],
    about_title:   'About',
    about_content: '<p><strong>4 years in Web2. 2+ years in Web3.</strong> Specializing in AI-powered applications, full-stack development, smart contracts, and DeFi protocols.</p><p>I\'ve built AI tools, DeFi apps, NFT platforms, and more. I focus on writing clean code that actually works in production.</p><p>I also create educational blockchain content on emerging tech like privacy, stablecoins, cross-chain protocols, and decentralized AI.</p>',
    about_stats: [
      { number: '4+',  label: 'Years in Web2'    },
      { number: '2+',  label: 'Years in Web3'    },
      { number: '10+', label: 'Projects Shipped' },
      { number: '5+',  label: 'Chains Deployed'  },
    ],
    skills_title: 'Tech Stack',
    skills_categories: [
      { category: 'Blockchain', items: ['Solidity', 'Hardhat', 'Foundry', 'Ethers.js', 'Wagmi', 'IPFS', 'The Graph'] },
      { category: 'Frontend',   items: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'React Native'] },
      { category: 'Backend',    items: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Firebase', 'Redis'] },
    ],
    projects_title:       'Featured Projects',
    contact_title:        'Contact',
    contact_heading:      "Let's build something together",
    contact_content:      "I'm always open to discussing Web3 projects, smart contract audits, or collaboration opportunities. Drop me a message!",
    contact_email:        'hello@ade.dev',
    contact_social_links: [
      { platform: 'GitHub',    url: 'https://github.com/yourhandle'      },
      { platform: 'Twitter/X', url: 'https://twitter.com/yourhandle'     },
      { platform: 'LinkedIn',  url: 'https://linkedin.com/in/yourhandle' },
    ],
  }
  try {
    await api('POST', '/items/home', homePayload)
    log.ok('home record created')
  } catch {
    await api('PATCH', '/items/home', homePayload)
    log.ok('home record updated')
  }

  // ── 9. Seed site_settings ─────────────────────────────────────────────────
  log.step('Seed  site_settings singleton')
  const settingsPayload = {
    title:       "Ade's Portfolio",
    description: 'Full-stack blockchain developer specializing in Web3 & AI.',
    logo_text:   'ade.dev',
    footer_text: '© 2025 Ade. Built with Next.js & Directus.',
    nav_items: [
      { label: 'About',    href: '#about'    },
      { label: 'Skills',   href: '#skills'   },
      { label: 'Projects', href: '#projects' },
      { label: 'Contact',  href: '#contact'  },
    ],
  }
  try {
    await api('POST', '/items/site_settings', settingsPayload)
    log.ok('site_settings created')
  } catch {
    await api('PATCH', '/items/site_settings', settingsPayload)
    log.ok('site_settings updated')
  }

  // ── 10. Seed projects ─────────────────────────────────────────────────────
  log.step('Seed  projects')

  const projectsRes: any = await api('GET', '/items/projects?fields=id,slug&limit=-1')
  const existingProjects: any[] = Array.isArray(projectsRes) ? projectsRes : (projectsRes?.data ?? [])
  const existingSlugs = new Set(existingProjects.map((p: any) => p.slug))

  // Map hardcoded tech name → seeded technology UUID
  const techSlugMap: Record<string, string> = {
    'Solidity':     techMap['solidity']     ?? '',
    'React':        techMap['react']        ?? '',
    'IPFS':         techMap['ipfs']         ?? '',
    'Ethers.js':    techMap['ethersjs']     ?? '',
    'Python':       techMap['python']       ?? '',
    'Flask':        techMap['flask']        ?? '',
    'PostgreSQL':   techMap['postgresql']   ?? '',
    'React Native': techMap['react-native'] ?? '',
    'Node.js':      techMap['nodejs']       ?? '',
    'Web3':         techMap['web3']         ?? '',
  }

  for (const p of hardcodedProjects) {
    if (existingSlugs.has(p.slug)) { log.skip(`project: ${p.slug}`); continue }

    // Note: process in hardcoded data is string[], but the Repeater stores [{step:"…"}]
    const processRepeater = p.process?.map((step) => ({ step })) ?? null

    const created: any = await api('POST', '/items/projects?fields=id,slug', {
      title:               p.title,
      slug:                p.slug,
      subtitle:            p.subtitle            ?? null,
      description:         p.description,
      link_code:           p.links.code          ?? null,
      link_demo:           p.links.demo          ?? null,
      image:               p.image,
      icon:                p.icon                ?? null,
      featured:            p.featured,
      client:              p.client              ?? null,
      location:            p.location            ?? null,
      service_type:        p.serviceType         ?? null,
      overview:            p.overview            ?? null,
      process:             processRepeater,
      results:             p.results             ?? null,
      testimonial_content: p.testimonial?.content ?? null,
      testimonial_author:  p.testimonial?.author  ?? null,
      testimonial_role:    p.testimonial?.role     ?? null,
      final_thoughts:      p.finalThoughts        ?? null,
    })

    for (const techName of p.tech) {
      const techId = techSlugMap[techName]
      if (!techId) continue
      await safe(
        () => api('POST', '/items/projects_technologies', {
          projects_id: created.id,
          technologies_id: techId,
        }),
        ...SKIP,
      )
    }

    log.ok(`project: ${p.title}`)
  }

  // ─────────────────────────────────────────────────────────────────────────
  console.log('\n✅ Setup complete!\n')
}

// ─── Grant public read access ──────────────────────────────────────────────────
async function grantPublicReadAccess() {
  const collections = ['projects', 'technologies', 'projects_technologies', 'home', 'site_settings', 'directus_files']

  // Directus 11: find the Public policy by its translated name label
  let policyId: string | null = null
  try {
    const res: any = await api('GET', '/policies?limit=-1')
    const list: any[] = Array.isArray(res) ? res : (res?.data ?? [])
    // Public policy is identified by name "$t:public_label" or by having no admin/app access
    policyId =
      list.find((p: any) => p.name === '$t:public_label')?.id ??
      list.find((p: any) => !p.admin_access && !p.app_access && p.name !== 'Administrator')?.id ??
      null
  } catch { /* not available */ }

  if (policyId) {
    for (const collection of collections) {
      await safe(
        () => api('POST', '/permissions', { policy: policyId, collection, action: 'read', fields: '*' }),
        ...SKIP,
      )
      log.ok(`public read: ${collection}`)
    }
    return
  }

  // Directus 10 fallback: role = null means "public / unauthenticated"
  let worked = false
  for (const collection of collections) {
    try {
      await api('POST', '/permissions', { role: null, collection, action: 'read', fields: '*' })
      log.ok(`public read: ${collection}`)
      worked = true
    } catch (e: any) {
      const msg = (e.message ?? '').toLowerCase()
      if (SKIP.some((s) => msg.includes(s.toLowerCase()))) {
        log.ok(`public read: ${collection} (already set)`)
        worked = true
      }
    }
  }
  if (worked) return

  // No automatic path found — print clear instructions
  log.warn('Could not set public permissions automatically.')
  log.warn('Manual step required (one-time):')
  log.warn('  http://localhost:8055/admin/settings/policies')
  log.warn('  → Public → enable Read on each collection below:')
  for (const c of collections) log.warn(`    · ${c}`)
}

main().catch((e) => {
  console.error('\n✗ Setup failed:', e.message ?? e)
  if (e.json) console.error('  API response:', JSON.stringify(e.json, null, 2))
  process.exit(1)
})
