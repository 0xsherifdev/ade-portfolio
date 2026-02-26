import { createDirectus, rest, staticToken } from '@directus/sdk'
import type { Schema } from './directus-types'

const url = process.env.DIRECTUS_URL
const token = process.env.DIRECTUS_TOKEN

/**
 * Resolves a Directus file UUID to its public asset URL.
 * Returns null if fileId or DIRECTUS_URL is not set.
 */
export function getAssetUrl(fileId: string | null | undefined): string | null {
  if (!fileId || !url) return null
  return `${url}/assets/${fileId}`
}

/**
 * Directus SDK client. Null when DIRECTUS_URL is not configured (e.g. local dev
 * without Docker or CI environments). All callers should handle the null case.
 */
const directus = url
  ? token
    ? createDirectus<Schema>(url).with(staticToken(token)).with(rest())
    : createDirectus<Schema>(url).with(rest())
  : null

export default directus
