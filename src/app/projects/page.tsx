import { projects } from '@/data/projects';
import Link from 'next/link';
import Image from 'next/image';

export default function ProjectsPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-12 max-w-[1400px] mx-auto">
      <div className="mb-16">
        <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors mb-8">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5m7 7-7-7 7-7"/>
          </svg>
          Go back
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">All Projects</h1>
        <p className="text-text-secondary max-w-2xl text-lg">
          A collection of my work in blockchain, AI, and full-stack development.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Link href={`/projects/${project.slug}`} key={project.id} className="group bg-bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-all duration-300 flex flex-col">
            <div className="aspect-video relative bg-bg-secondary overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent opacity-60"></div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-4">
                 <span className="font-mono text-xs text-accent">{'//'} {project.serviceType || 'Project'}</span>
                 <span className="text-2xl">{project.icon}</span>
              </div>
              <h2 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">{project.title}</h2>
              <p className="text-text-secondary text-sm mb-6 flex-1 line-clamp-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tech.slice(0, 3).map((t, i) => (
                  <span key={i} className="font-mono text-[10px] px-2 py-1 bg-bg-secondary text-text-muted rounded">
                    {t}
                  </span>
                ))}
                {project.tech.length > 3 && (
                   <span className="font-mono text-[10px] px-2 py-1 bg-bg-secondary text-text-muted rounded">
                    +{project.tech.length - 3}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
