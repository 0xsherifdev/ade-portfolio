import Link from 'next/link';
import PlaceholderImage from './ui/PlaceholderImage';

const Projects = () => {
  const projects = [
    {
      title: "Arcade",
      description: "An AI agent rental marketplace deployed on Arc blockchain. Features comprehensive smart contract functionality with platform fees, IPFS integration for agent metadata, and real-time earnings tracking for agent providers.",
      tech: ["Solidity", "Arc Network", "IPFS", "React", "Ethers.js"],
      links: { code: "#", demo: "https://arcademp.vercel.app/" },
      image: "arcade-preview.png",
      featured: true,
      icon: "🎮"
    },
    {
      title: "PhishFinder",
      description: "Advanced AI-powered phishing URL detection tool. Scans URLs in real-time to identify potential phishing attempts and protect users from malicious websites.",
      tech: ["Python", "Flask", "Machine Learning", "AI"],
      links: { code: "#", demo: "https://phishing-detector-flask.vercel.app/" },
      image: "phishfinder-preview.png",
      featured: true,
      icon: "🎣"
    },
    {
      title: "NFT Marketplace",
      description: "Full-featured NFT marketplace with custom event indexing using Rindexer and PostgreSQL. Supports minting, listing, bidding, and real-time activity tracking with optimized database queries.",
      tech: ["Solidity", "Rindexer", "PostgreSQL", "React", "IPFS"],
      links: { code: "#", demo: "#" },
      image: "",
      featured: true,
      icon: "🎨"
    },
    {
      title: "Grid Fintech",
      description: "Multi-chain fintech application with wallet import functionality supporting multiple blockchain networks. Features secure key management and seamless cross-chain asset tracking.",
      tech: ["React Native", "Node.js", "Multi-chain", "Web3"],
      links: { code: "#", demo: "#" },
      image: "",
      featured: true,
      icon: "💰"
    }
  ];

  return (
    <section id="projects" className="py-32 px-4 md:px-12 max-w-[1400px] mx-auto reveal">
      <div className="flex items-center gap-6 mb-16">
        <span className="font-mono text-accent">03</span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Projects</h2>
        <div className="flex-1 h-px bg-border max-w-[300px]"></div>
      </div>

      <div className="grid gap-16">
        {projects.map((project, index) => (
          <div key={index} className={`grid md:grid-cols-2 gap-12 p-12 bg-bg-card border border-border hover:border-accent transition-all duration-300 ${index % 2 !== 0 ? 'md:[direction:rtl]' : ''}`}>
            <div className={`flex flex-col justify-center ${index % 2 !== 0 ? 'md:[direction:ltr]' : ''}`}>
              <div className="font-mono text-xs text-accent mb-4">{'//'} Featured Project</div>
              <h3 className="text-3xl font-bold mb-4 tracking-tighter">{project.title}</h3>
              <p className="text-text-secondary mb-6 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((t, i) => (
                  <span key={i} className="font-mono text-xs px-3 py-1 bg-bg-secondary text-text-muted">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <Link href={project.links.code} target="_blank" rel="noopener noreferrer" className="text-text-secondary flex items-center gap-2 text-sm hover:text-accent transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                  Code
                </Link>
                <Link href={project.links.demo} target="_blank" rel="noopener noreferrer" className="text-text-secondary flex items-center gap-2 text-sm hover:text-accent transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Live Demo
                </Link>
              </div>
            </div>
            <div className={`aspect-[16/10] flex items-center justify-center overflow-hidden relative rounded-lg border border-border bg-gradient-to-br from-bg-secondary to-bg-card ${index % 2 !== 0 ? 'md:[direction:ltr]' : ''}`}>
                <PlaceholderImage alt={project.title} className="w-full h-full" icon={project.icon} />
                <div className="absolute inset-0 bg-gradient-to-br from-accent-dim/5 to-transparent pointer-events-none z-10"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
