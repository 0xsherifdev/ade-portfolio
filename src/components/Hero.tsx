import Link from 'next/link';
import { RichText } from '@payloadcms/richtext-lexical/react';

interface HeroProps {
  data?: {
    topText?: string | null;
    headline?: any;
    subheadline?: string | null;
    buttons?: Array<{
      label?: string | null;
      link?: string | null;
      style?: 'primary' | 'outline' | null;
    }> | null;
  };
}

const Hero = ({ data }: HeroProps) => {
  const topText = data?.topText || 'Web3 Developer';
  const subheadline = data?.subheadline || "I'm Ade — a full-stack blockchain developer specializing in smart contracts, DeFi protocols, and AI-powered Web3 applications. Turning ideas into production-ready code.";

  const defaultButtons = [
    { label: 'View Projects →', link: '#projects', style: 'primary' as const },
    { label: 'Get in Touch', link: '#contact', style: 'outline' as const },
  ];
  const buttons = data?.buttons?.length ? data.buttons : defaultButtons;

  return (
    <section className="min-h-screen flex flex-col justify-center px-4 md:px-12 max-w-[1400px] mx-auto pt-20 relative">
      <div className="animate-fade-up">
        <div className="font-mono text-sm text-accent mb-6 flex items-center gap-3 before:content-[''] before:w-10 before:h-px before:bg-accent">
          {topText}
        </div>
        {data?.headline ? (
          <div className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6 tracking-tighter [&_em]:text-accent [&_em]:relative [&_em]:not-italic">
            <RichText data={data.headline} />
          </div>
        ) : (
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6 tracking-tighter">
            Building the <span className="text-accent relative">decentralized</span> future
          </h1>
        )}
        <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mb-10 font-light">
          {subheadline}
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          {buttons.map((button, index) => (
            <Link
              key={index}
              href={button.link || '#'}
              className={
                button.style === 'primary'
                  ? "font-mono text-sm px-8 py-4 border border-accent bg-accent text-bg-primary hover:bg-transparent hover:text-accent transition-all duration-300 inline-flex items-center justify-center gap-2 hover:-translate-y-0.5"
                  : "font-mono text-sm px-8 py-4 border border-border text-text-primary hover:border-accent hover:text-accent hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center justify-center gap-2"
              }
            >
              {button.label || (button.style === 'primary' ? 'View Projects →' : 'Get in Touch')}
            </Link>
          ))}
        </div>
      </div>
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce hidden md:flex">
        <span className="font-mono text-xs text-text-muted rotate-180 [writing-mode:vertical-rl]">scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-accent to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;
