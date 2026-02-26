import { readItems } from '@directus/sdk'
import directus, { getAssetUrl } from '@/lib/directus'
import { projects as hardcodedProjects } from '@/data/projects'
import type { DirectusProject } from '@/lib/directus-types'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

// Normalised shape used by the template — works for both Directus and hardcoded data.
interface ProjectView {
  id: string
  slug: string
  title: string
  subtitle?: string
  description: string
  tech: string[]
  links: { code?: string; demo?: string }
  image: string
  client?: string
  location?: string
  serviceType?: string
  overview?: string
  process?: string[]
  results?: { label: string; value: string }[]
  testimonial?: { content: string; author: string; role: string }
  finalThoughts?: string
}

async function fetchProject(slug: string): Promise<ProjectView | null> {
  if (directus) {
    try {
      const data = await directus.request(
        readItems('projects', {
          filter: { slug: { _eq: slug } },
          fields: [
            'id', 'slug', 'title', 'subtitle', 'description',
            'link_code', 'link_demo', 'image', 'icon', 'featured',
            'client', 'location', 'service_type',
            'overview', 'process', 'results',
            'testimonial_content', 'testimonial_author', 'testimonial_role',
            'final_thoughts',
            'tech.technologies_id.id',
            'tech.technologies_id.name',
          ],
          limit: 1,
        })
      )
      const p = (data as DirectusProject[])[0]
      if (p) {
        return {
          id: p.id,
          slug: p.slug,
          title: p.title,
          subtitle: p.subtitle ?? undefined,
          description: p.description,
          tech: (p.tech ?? []).map((t) => t.technologies_id?.name ?? '').filter(Boolean),
          links: { code: p.link_code ?? undefined, demo: p.link_demo ?? undefined },
          image: p.image?.startsWith('http') ? p.image : (getAssetUrl(p.image) ?? '/placeholder.jpg'),
          client: p.client ?? undefined,
          location: p.location ?? undefined,
          serviceType: p.service_type ?? undefined,
          overview: p.overview ?? undefined,
          // process is stored as [{step:"…"}] via the Repeater interface
          process: p.process
            ? (p.process as any[]).map((r) => r.step ?? r).filter(Boolean)
            : undefined,
          results: p.results ?? undefined,
          testimonial:
            p.testimonial_content && p.testimonial_author
              ? {
                  content: p.testimonial_content,
                  author: p.testimonial_author,
                  role: p.testimonial_role ?? '',
                }
              : undefined,
          finalThoughts: p.final_thoughts ?? undefined,
        }
      }
    } catch (error) {
      console.error('[Directus] Failed to fetch project:', error)
    }
  }

  // Fallback to hardcoded data.
  const p = hardcodedProjects.find((p) => p.slug === slug)
  if (!p) return null
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    description: p.description,
    tech: p.tech,
    links: p.links,
    image: p.image,
    client: p.client,
    location: p.location,
    serviceType: p.serviceType,
    overview: p.overview,
    process: p.process,
    results: p.results,
    testimonial: p.testimonial,
    finalThoughts: p.finalThoughts,
  }
}


async function fetchRelated(currentId: string): Promise<ProjectView[]> {
  if (directus) {
    try {
      const data = await directus.request(
        readItems('projects', {
          filter: { id: { _neq: currentId } },
          fields: [
            'id', 'slug', 'title', 'subtitle', 'description',
            'image', 'service_type',
            'tech.technologies_id.name',
          ],
          limit: 2,
        })
      )
      return (data as DirectusProject[]).map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle ?? undefined,
        description: p.description,
        tech: (p.tech ?? []).map((t) => t.technologies_id?.name ?? '').filter(Boolean),
        links: {},
        image: p.image?.startsWith('http') ? p.image : (getAssetUrl(p.image) ?? '/placeholder.jpg'),
        serviceType: p.service_type ?? undefined,
      }))
    } catch {
      // fall through
    }
  }
  return hardcodedProjects
    .filter((p) => p.id !== currentId)
    .slice(0, 2)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      description: p.description,
      tech: p.tech,
      links: p.links,
      image: p.image,
      serviceType: p.serviceType,
    }))
}

export const dynamic = 'force-dynamic'

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [project, relatedProjects] = await Promise.all([
    fetchProject(slug),
    fetchProject(slug).then((p) => (p ? fetchRelated(p.id) : [])),
  ])

  if (!project) notFound()

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-12 max-w-[1000px] mx-auto">
      {/* Navigation */}
      <div className="mb-12">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors group"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="group-hover:-translate-x-1 transition-transform"
          >
            <path d="M19 12H5m7 7-7-7 7-7" />
          </svg>
          Go back
        </Link>
      </div>

      {/* Header */}
      <header className="mb-20">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 leading-tight">
          {project.subtitle || project.title}
        </h1>
        <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-3xl leading-relaxed">
          {project.description}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-8 mb-8">
          <div>
            <h3 className="text-sm font-mono text-text-muted mb-2">Client</h3>
            <p className="font-medium">{project.client || 'Confidential'}</p>
          </div>
          <div>
            <h3 className="text-sm font-mono text-text-muted mb-2">Location</h3>
            <p className="font-medium">{project.location || 'Remote'}</p>
          </div>
          <div className="col-span-2 md:col-span-2">
            <h3 className="text-sm font-mono text-text-muted mb-2">Service Type</h3>
            <p className="font-medium">{project.serviceType || 'Development'}</p>
          </div>
        </div>

        {/* Tech stack + links */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
          {project.tech.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="font-mono text-xs px-3 py-1.5 bg-bg-secondary border border-border rounded text-text-muted">
                  {t}
                </span>
              ))}
            </div>
          )}
          {(project.links.code || project.links.demo) && (
            <div className="flex items-center gap-3">
              {project.links.code && (
                <a
                  href={project.links.code}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded text-sm font-medium hover:border-accent hover:text-accent transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Code
                </a>
              )}
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-bg-primary rounded text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Live Demo
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Hero Image */}
      <div className="mb-24 relative aspect-video rounded-xl overflow-hidden bg-bg-secondary border border-border">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/20 to-transparent"></div>
      </div>

      {/* Overview */}
      <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-24 mb-24">
        <div className="md:sticky md:top-32 h-fit">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
        </div>
        <div className="prose prose-invert prose-lg text-text-secondary">
          {project.overview ? (
            <div
              className="whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{ __html: project.overview }}
            />
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed">{project.description}</p>
          )}
        </div>
      </div>

      {/* Process */}
      {project.process && (
        <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-24 mb-24">
          <div className="md:sticky md:top-32 h-fit">
            <h2 className="text-2xl font-bold mb-4">Our Process</h2>
          </div>
          <div>
            <p className="text-text-secondary mb-8 text-lg">
              We designed a client-focused model through:
            </p>
            <ul className="space-y-6">
              {project.process.map((step, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-mono text-sm border border-accent/20">
                    {i + 1}
                  </span>
                  <span className="text-lg pt-1">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Results */}
      {project.results && (
        <div className="mb-24 bg-bg-card border border-border rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-12">Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {project.results.map((result, i) => (
              <div key={i} className="text-center md:text-left">
                <div className="text-5xl md:text-6xl font-bold text-accent mb-2 tracking-tighter">
                  {result.value}
                </div>
                <div className="text-text-secondary font-medium">{result.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonial */}
      {project.testimonial && (
        <div className="mb-24 relative">
          <div className="absolute -left-4 -top-4 text-6xl text-accent/20 font-serif">"</div>
          <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed mb-8 relative z-10">
            {project.testimonial.content}
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-bg-secondary rounded-full flex items-center justify-center text-xl border border-border">
              {project.testimonial.author[0]}
            </div>
            <div>
              <div className="font-bold">{project.testimonial.author}</div>
              <div className="text-sm text-text-secondary">{project.testimonial.role}</div>
            </div>
          </div>
        </div>
      )}

      {/* Final Thoughts */}
      {project.finalThoughts && (
        <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-24 mb-32">
          <div className="md:sticky md:top-32 h-fit">
            <h2 className="text-2xl font-bold mb-4">Final Thoughts</h2>
          </div>
          <div className="prose prose-invert prose-lg text-text-secondary">
            <p className="leading-relaxed">{project.finalThoughts}</p>
          </div>
        </div>
      )}

      {/* Related Projects */}
      <div className="border-t border-border pt-24">
        <h2 className="text-3xl font-bold mb-4">Related Case Studies</h2>
        <p className="text-text-secondary mb-12 max-w-2xl">
          Discover more projects that drove real results and helped clients achieve measurable,
          lasting growth worldwide.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {relatedProjects.map((p) => (
            <Link
              href={`/projects/${p.slug}`}
              key={p.id}
              className="group bg-bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-all duration-300"
            >
              <div className="aspect-[16/9] relative bg-bg-secondary overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <div className="font-mono text-xs text-accent mb-4">{'//'} {p.serviceType}</div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-accent transition-colors">
                  {p.subtitle || p.title}
                </h3>
                <div className="flex items-center gap-2 text-sm font-medium text-text-secondary group-hover:text-white transition-colors">
                  Read full case study
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors font-medium"
          >
            View more case studies
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  )
}
