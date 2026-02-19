import Link from 'next/link';

interface ContactProps {
  data?: {
    title?: string | null;
    heading?: string | null;
    content?: string | null;
    email?: string | null;
    socialLinks?: Array<{
      platform?: string | null;
      url?: string | null;
    }> | null;
  };
}

const socialIcons: Record<string, React.ReactNode> = {
  github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>,
  'twitter/x': <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>,
  twitter: <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>,
  linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></>,
};

const Contact = ({ data }: ContactProps) => {
  const title = data?.title || 'Contact';
  const heading = data?.heading || "Let's build something together";
  const content = data?.content || "I'm always open to discussing Web3 projects, smart contract audits, or collaboration opportunities. Drop me a message!";
  const email = data?.email || 'hello@ade.dev';

  const defaultSocials = [
    { platform: 'GitHub', url: '#' },
    { platform: 'Twitter/X', url: '#' },
    { platform: 'LinkedIn', url: '#' },
  ];
  const socialLinks = data?.socialLinks?.length ? data.socialLinks : defaultSocials;

  return (
    <section id="contact" className="py-32 px-4 md:px-12 max-w-[1400px] mx-auto reveal">
      <div className="flex items-center gap-6 mb-16">
        <span className="font-mono text-accent">04</span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
        <div className="flex-1 h-px bg-border max-w-[300px]"></div>
      </div>

      <div className="text-center max-w-[700px] mx-auto">
        <h3 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{heading}</h3>
        <p className="text-xl text-text-secondary mb-12 font-light">
          {content}
        </p>
        <Link href={`mailto:${email}`} className="font-mono text-lg text-accent inline-block px-8 py-4 border border-border mb-12 hover:border-accent hover:bg-accent-dim transition-all duration-300">
          {email}
        </Link>
        <div className="flex justify-center gap-8">
          {socialLinks.map((social, index) => {
            const platformKey = (social.platform || '').toLowerCase();
            const icon = socialIcons[platformKey];
            return (
              <Link key={index} href={social.url || '#'} className="text-text-muted font-mono text-sm flex items-center gap-2 hover:text-accent transition-colors duration-300">
                {icon && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {icon}
                  </svg>
                )}
                {social.platform}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Contact;
