import Link from 'next/link';
import { notFound } from 'next/navigation';
import { caseStudies } from '@/data/caseStudies';
import type { Metadata } from 'next';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) return { title: 'Case Study Not Found' };
  return {
    title: `${cs.title} | Ade Case Study`,
    description: cs.subtitle,
  };
}

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) notFound();

  const related = caseStudies.filter((c) => c.slug !== slug).slice(0, 2);

  return (
    <main className="case-study-page">
      {/* Back Link */}
      <div className="px-4 md:px-12 max-w-[1400px] mx-auto pt-28 md:pt-32">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 font-mono text-sm text-text-secondary hover:text-accent transition-colors group"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-transform group-hover:-translate-x-1"
          >
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Go back
        </Link>
      </div>

      {/* Hero */}
      <section className="px-4 md:px-12 max-w-[1400px] mx-auto pt-12 pb-20">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 leading-[1.1] case-study-fade-in">
          {cs.title}
        </h1>
        <p className="text-lg md:text-xl text-text-secondary max-w-3xl mb-12 font-light case-study-fade-in" style={{ animationDelay: '0.1s' }}>
          {cs.subtitle}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 case-study-fade-in" style={{ animationDelay: '0.2s' }}>
          {[
            { label: 'Client', value: cs.client },
            { label: 'Location', value: cs.location },
            { label: 'Service Type', value: cs.serviceType },
          ].map((item) => (
            <div key={item.label} className="p-6 bg-bg-card border border-border">
              <div className="font-mono text-xs text-text-muted mb-2 uppercase tracking-wider">{item.label}</div>
              <div className="text-text-primary font-medium">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Company Logo Placeholder */}
        <div className="case-study-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="w-16 h-16 bg-bg-card border border-border flex items-center justify-center text-2xl rounded-lg">
            {cs.icon}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12">
        <div className="h-px bg-border"></div>
      </div>

      {/* Overview */}
      <section className="px-4 md:px-12 max-w-[1400px] mx-auto py-20">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 flex items-center gap-4">
          <span className="font-mono text-accent text-base">01</span>
          Overview
        </h2>
        <div className="max-w-3xl space-y-6">
          {cs.overview.map((p, i) => (
            <p key={i} className="text-text-secondary text-lg leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12">
        <div className="h-px bg-border"></div>
      </div>

      {/* Process */}
      <section className="px-4 md:px-12 max-w-[1400px] mx-auto py-20">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 flex items-center gap-4">
          <span className="font-mono text-accent text-base">02</span>
          Our Process
        </h2>
        <div className="max-w-3xl">
          <p className="text-text-secondary text-lg leading-relaxed mb-8">
            {cs.process.intro}
          </p>
          <div className="space-y-6 mb-8">
            {cs.process.steps.map((step, i) => (
              <div key={i} className="process-step flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 border border-accent flex items-center justify-center font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <p className="text-text-secondary leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>
          <p className="text-text-secondary text-lg leading-relaxed">
            {cs.process.summary}
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12">
        <div className="h-px bg-border"></div>
      </div>

      {/* Results */}
      <section className="px-4 md:px-12 max-w-[1400px] mx-auto py-20">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 flex items-center gap-4">
          <span className="font-mono text-accent text-base">03</span>
          Results
        </h2>
        <p className="text-text-secondary text-lg leading-relaxed max-w-3xl mb-12">
          {cs.results.summary}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cs.results.stats.map((stat, i) => (
            <div
              key={i}
              className="case-study-stat p-8 bg-bg-card border border-border text-center hover:border-accent transition-all duration-300"
            >
              <div className="font-mono text-4xl md:text-5xl font-bold text-accent mb-3">
                {stat.value}
              </div>
              <div className="text-sm text-text-secondary font-mono uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12">
        <div className="h-px bg-border"></div>
      </div>

      {/* Testimonial */}
      <section className="px-4 md:px-12 max-w-[1400px] mx-auto py-20">
        <div className="testimonial-card max-w-3xl p-8 md:p-12 bg-bg-card border border-border border-l-accent border-l-2">
          <blockquote className="text-lg md:text-xl text-text-primary leading-relaxed mb-8 italic">
            &ldquo;{cs.testimonial.quote}&rdquo;
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center font-mono text-accent text-sm font-bold">
              {cs.testimonial.author.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-text-primary">{cs.testimonial.author}</div>
              <div className="text-sm text-text-secondary">{cs.testimonial.role}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12">
        <div className="h-px bg-border"></div>
      </div>

      {/* Final Thoughts */}
      <section className="px-4 md:px-12 max-w-[1400px] mx-auto py-20">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 flex items-center gap-4">
          <span className="font-mono text-accent text-base">04</span>
          Final Thoughts
        </h2>
        <p className="text-text-secondary text-lg leading-relaxed max-w-3xl">
          {cs.finalThoughts}
        </p>
      </section>

      {/* Divider */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12">
        <div className="h-px bg-border"></div>
      </div>

      {/* Related Case Studies */}
      <section className="px-4 md:px-12 max-w-[1400px] mx-auto py-20 pb-32">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
          Related Case Studies
        </h2>
        <p className="text-text-secondary mb-12 max-w-2xl">
          Discover more projects that drove real results and helped clients achieve measurable, lasting growth worldwide.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/case-studies/${r.slug}`}
              className="case-study-card group block p-8 bg-bg-card border border-border hover:border-accent transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-bg-secondary border border-border flex items-center justify-center rounded-lg text-lg">
                  {r.icon}
                </div>
                <span className="font-mono text-xs text-accent flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read full case study
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-tight group-hover:text-accent transition-colors">
                {r.title}
              </h3>
              <p className="text-sm text-text-secondary mb-6 line-clamp-2">
                {r.subtitle}
              </p>
              <div className="flex gap-6">
                {r.results.stats.slice(0, 2).map((stat, i) => (
                  <div key={i}>
                    <div className="font-mono text-lg font-bold text-accent">{stat.value}</div>
                    <div className="text-xs text-text-muted">{stat.label}</div>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/#projects"
            className="font-mono text-sm text-text-secondary hover:text-accent transition-colors inline-flex items-center gap-2"
          >
            View more case studies
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
