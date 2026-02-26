import { readSingleton, readItems } from '@directus/sdk'
import directus, { getAssetUrl } from '@/lib/directus'
import type { DirectusHome, DirectusProject, DirectusTechJunction } from '@/lib/directus-types'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'

// Always fetch fresh — this page is CMS-driven.
export const dynamic = 'force-dynamic'

export default async function Home() {
  let home: DirectusHome | null = null
  let featuredProjects: Array<{
    id: string; slug: string; title: string; description: string;
    tech: string[]; links: { code?: string; demo?: string }; image: string; imageAlt: string;
  }> = []

  if (directus) {
    try {
      const [homeData, projectsData] = await Promise.all([
        directus.request(readSingleton('home')),
        directus.request(
          readItems('projects', {
            filter: { featured: { _eq: true } },
            fields: [
              'id', 'slug', 'title', 'subtitle', 'description',
              'link_code', 'link_demo', 'image', 'icon', 'featured',
              'tech.technologies_id.id',
              'tech.technologies_id.name',
              'tech.technologies_id.slug',
            ],
            limit: 20,
          })
        ),
      ])
      home = homeData
      // Transform Directus records into the shape that <Projects> expects.
      featuredProjects = (projectsData as DirectusProject[]).map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        tech: (p.tech as DirectusTechJunction[] ?? [])
          .map((t) => t.technologies_id?.name ?? '')
          .filter(Boolean),
        links: { code: p.link_code ?? undefined, demo: p.link_demo ?? undefined },
        image: p.image?.startsWith('http') ? p.image : (getAssetUrl(p.image) ?? ''),
        imageAlt: p.title,
      }))
    } catch (error) {
      console.error('[Directus] Failed to fetch home page data:', error)
    }
  }

  return (
    <main>
      <Hero
        data={
          home
            ? {
                topText: home.hero_top_text,
                headline: home.hero_headline,
                subheadline: home.hero_subheadline,
                buttons: home.hero_buttons,
              }
            : undefined
        }
      />
      <About
        data={
          home
            ? {
                title: home.about_title,
                content: home.about_content,
                stats: home.about_stats,
              }
            : undefined
        }
      />
      <Skills
        data={
          home
            ? {
                title: home.skills_title,
                categories: home.skills_categories,
              }
            : undefined
        }
      />
      <Projects
        data={home ? { title: home.projects_title } : undefined}
        projects={featuredProjects}
      />
      <Contact
        data={
          home
            ? {
                title: home.contact_title,
                heading: home.contact_heading,
                content: home.contact_content,
                email: home.contact_email,
                socialLinks: home.contact_social_links,
              }
            : undefined
        }
      />
    </main>
  )
}
