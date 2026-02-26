'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { projects as hardcodedProjects } from '@/data/projects';

interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  tech: string[];
  links: { code?: string; demo?: string };
  image: string;
  imageAlt: string;
}

interface ProjectsProps {
  data?: {
    title?: string | null;
    description?: string | null;
  };
  /** Pre-resolved project list from the server (image URLs already resolved). */
  projects?: ProjectItem[];
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const Projects = ({ data, projects: cmsProjects }: ProjectsProps) => {
  const title = data?.title || 'Featured Projects';

  const projectItems: ProjectItem[] =
    cmsProjects && cmsProjects.length > 0
      ? cmsProjects
      : hardcodedProjects.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          description: p.description,
          tech: p.tech,
          links: p.links,
          image: p.image,
          imageAlt: p.title,
        }));

  return (
    <section id="projects" className="py-32 px-4 md:px-12 max-w-[1400px] mx-auto">
      <motion.div
        className="flex items-center gap-6 mb-16"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        <span className="font-mono text-accent">03</span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
        <div className="flex-1 h-px bg-border max-w-[300px]"></div>
      </motion.div>

      <div className="grid gap-16">
        {projectItems.map((project, index) => (
          <motion.div
            key={project.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className={`grid md:grid-cols-2 gap-12 p-12 bg-bg-card border border-border hover:border-accent transition-all duration-300 ${index % 2 !== 0 ? 'md:[direction:rtl]' : ''}`}
          >
            <div className={`flex flex-col justify-center ${index % 2 !== 0 ? 'md:[direction:ltr]' : ''}`}>
              <div className="font-mono text-xs text-accent mb-4">{'//'} Featured Project</div>
              <Link href={`/projects/${project.slug}`} className="hover:text-accent transition-colors w-fit">
                <h3 className="text-3xl font-bold mb-4 tracking-tighter">{project.title}</h3>
              </Link>
              <p className="text-text-secondary mb-6 leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((t, i) => (
                  <span key={i} className="font-mono text-xs px-3 py-1 bg-bg-secondary text-text-muted">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-text-primary flex items-center gap-2 text-sm hover:text-accent transition-colors font-medium"
                >
                  View Case Study
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </Link>
                {project.links.code && (
                  <Link
                    href={project.links.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary flex items-center gap-2 text-sm hover:text-accent transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                    Code
                  </Link>
                )}
                {project.links.demo && (
                  <Link
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary flex items-center gap-2 text-sm hover:text-accent transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Live Demo
                  </Link>
                )}
              </div>
            </div>
            <Link
              href={`/projects/${project.slug}`}
              className={`aspect-[16/10] block overflow-hidden relative rounded-lg border border-border bg-bg-secondary group ${index % 2 !== 0 ? 'md:[direction:ltr]' : ''}`}
            >
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-accent-dim/5 to-transparent pointer-events-none z-10"></div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-16 text-center"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors border-b border-accent pb-1"
        >
          View All Projects
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14m-7-7 7 7-7 7" />
          </svg>
        </Link>
      </motion.div>
    </section>
  );
};

export default Projects;
