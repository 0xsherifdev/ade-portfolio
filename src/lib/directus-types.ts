export interface DirectusTechnology {
  id: string
  name: string
  slug: string
  icon?: string | null
}

// M2M junction record returned by Directus when requesting tech.technologies_id.*
export interface DirectusTechJunction {
  id: number
  technologies_id: DirectusTechnology
}

export interface DirectusProject {
  id: string
  slug: string
  title: string
  subtitle?: string | null
  description: string
  /** M2M — populated when fields includes 'tech.technologies_id.*' */
  tech?: DirectusTechJunction[] | null
  link_code?: string | null
  link_demo?: string | null
  /** Directus file UUID — use getAssetUrl() to resolve */
  image?: string | null
  icon?: string | null
  featured?: boolean | null
  client?: string | null
  location?: string | null
  service_type?: string | null
  /** Rich text stored as HTML */
  overview?: string | null
  /** JSON array of step strings */
  process?: string[] | null
  /** JSON array of {label, value} */
  results?: { label: string; value: string }[] | null
  testimonial_content?: string | null
  testimonial_author?: string | null
  testimonial_role?: string | null
  final_thoughts?: string | null
}

export interface DirectusHome {
  id: string
  hero_top_text?: string | null
  /** Plain text or HTML for the main headline */
  hero_headline?: string | null
  hero_subheadline?: string | null
  hero_buttons?: Array<{ label: string; link: string; style: 'primary' | 'outline' }> | null
  about_title?: string | null
  /** Rich text stored as HTML */
  about_content?: string | null
  about_stats?: Array<{ number: string; label: string }> | null
  skills_title?: string | null
  skills_categories?: Array<{ category: string; items: string[] }> | null
  projects_title?: string | null
  contact_title?: string | null
  contact_heading?: string | null
  contact_content?: string | null
  contact_email?: string | null
  contact_social_links?: Array<{ platform: string; url: string }> | null
}

export interface DirectusSiteSettings {
  id: string
  title?: string | null
  description?: string | null
  logo_text?: string | null
  footer_text?: string | null
  nav_items?: Array<{ label: string; href: string }> | null
}

export type Schema = {
  projects: DirectusProject[]
  technologies: DirectusTechnology[]
  home: DirectusHome
  site_settings: DirectusSiteSettings
}
