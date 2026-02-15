'use client';

import Link from 'next/link';

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center px-4 md:px-12 max-w-[1400px] mx-auto pt-20 relative">
      <div className="animate-fade-up">
        <div className="font-mono text-sm text-accent mb-6 flex items-center gap-3 before:content-[''] before:w-10 before:h-px before:bg-accent">
          Web3 Developer
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6 tracking-tighter">
          Building the <span className="text-accent relative">decentralized</span> future
        </h1>
        <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mb-10 font-light">
          I&apos;m Ade — a full-stack blockchain developer specializing in smart contracts, DeFi protocols, and AI-powered Web3 applications. Turning ideas into production-ready code.
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <Link href="#projects" className="font-mono text-sm px-8 py-4 border border-accent bg-accent text-bg-primary hover:bg-transparent hover:text-accent transition-all duration-300 inline-flex items-center justify-center gap-2 hover:-translate-y-0.5">
            View Projects →
          </Link>
          <Link href="#contact" className="font-mono text-sm px-8 py-4 border border-border text-text-primary hover:border-accent hover:text-accent hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center justify-center gap-2">
            Get in Touch
          </Link>
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
