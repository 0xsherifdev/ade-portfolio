'use client';

import useScrollReveal from '@/hooks/useScrollReveal';

const ScrollRevealWrapper = ({ children }: { children: React.ReactNode }) => {
  useScrollReveal();
  return <>{children}</>;
};

export default ScrollRevealWrapper;
