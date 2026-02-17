export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  tech: string[];
  links: {
    code?: string;
    demo?: string;
  };
  image: string;
  icon?: string;
  featured: boolean;
  client?: string;
  location?: string;
  serviceType?: string;
  overview?: string;
  process?: string[];
  results?: {
    label: string;
    value: string;
  }[];
  testimonial?: {
    content: string;
    author: string;
    role: string;
  };
  finalThoughts?: string;
}

export const projects: Project[] = [
  {
    id: "apex-solutions",
    slug: "apex-solutions",
    title: "Apex Solutions",
    subtitle: "Optimizing Client Retention",
    description: "Implemented data-led insights to improve growth and drive long-term sustainable business success.",
    tech: ["Data Analytics", "React", "Automated Feedback Systems"],
    links: { demo: "#" },
    image: "https://picsum.photos/seed/apex/800/600",
    icon: "📈",
    featured: true,
    client: "Apex Solutions",
    location: "Berlin, Germany",
    serviceType: "Customer Retention Strategy",
    overview: "Apex Solutions approached Elevare to address declining client retention and engagement. Their existing approach lacked personalization and performance tracking. The challenge was to create a retention framework that improved satisfaction, loyalty, and lifetime value.\n\nWe performed a deep analysis of client interactions and identified gaps in communication and follow-up. The strategy was designed to enhance experience while making engagement measurable and repeatable.",
    process: [
      "Mapping client journeys to identify weak engagement points.",
      "Building automated feedback and response systems.",
      "Introducing loyalty tracking dashboards.",
      "Training teams to personalize interactions based on data."
    ],
    results: [
      { label: "Retention Growth", value: "+45%" },
      { label: "Client Referrals", value: "+60%" },
      { label: "Repeat Value", value: "+80%" }
    ],
    testimonial: {
      content: "We finally understand what our clients need and when they need it. Elevare gave us a structure that keeps relationships growing.",
      author: "Lukas Weber",
      role: "Client Success Lead at Apex Solutions"
    },
    finalThoughts: "Retention drives stability. Through structure and insight, Apex turned client data into stronger, lasting partnerships."
  },
  {
    id: "arcade",
    slug: "arcade",
    title: "Arcade",
    subtitle: "AI Agent Marketplace",
    description: "An AI agent rental marketplace deployed on Arc blockchain. Features comprehensive smart contract functionality with platform fees, IPFS integration for agent metadata, and real-time earnings tracking for agent providers.",
    tech: ["Solidity", "Arc Network", "IPFS", "React", "Ethers.js"],
    links: { code: "#", demo: "https://arcademp.vercel.app/" },
    image: "https://picsum.photos/seed/arcade/800/600",
    icon: "🎮",
    featured: true,
    client: "Arcade Inc.",
    location: "Global",
    serviceType: "Blockchain Development",
    overview: "Arcade needed a decentralized platform to facilitate the rental of AI agents. Traditional marketplaces lacked transparency and security. The goal was to build a trustless environment where users could rent AI agents securely using blockchain technology.",
    process: [
      "Smart contract development for secure transactions.",
      "Integration with IPFS for decentralized storage.",
      "Frontend development for seamless user experience.",
      "Blockchain network deployment and testing."
    ],
    results: [
      { label: "Transactions Processed", value: "10k+" },
      { label: "Active Users", value: "500+" },
      { label: "Uptime", value: "99.9%" }
    ],
    testimonial: {
      content: "The platform is incredibly secure and easy to use. It has revolutionized how we access AI resources.",
      author: "Sarah Jenkins",
      role: "CTO at TechFlow"
    },
    finalThoughts: "Decentralization is key to the future of AI distribution. Arcade proves that blockchain can provide a secure and efficient marketplace for digital assets."
  },
  {
    id: "phishfinder",
    slug: "phishfinder",
    title: "PhishFinder",
    subtitle: "AI-Powered Security",
    description: "Advanced AI-powered phishing URL detection tool. Scans URLs in real-time to identify potential phishing attempts and protect users from malicious websites.",
    tech: ["Python", "Flask", "Machine Learning", "AI"],
    links: { code: "#", demo: "https://phishing-detector-flask.vercel.app/" },
    image: "https://picsum.photos/seed/phishfinder/800/600",
    icon: "🎣",
    featured: true,
    client: "CyberSafe",
    location: "New York, USA",
    serviceType: "Cybersecurity Solution",
    overview: "With the rise of sophisticated phishing attacks, CyberSafe needed a robust tool to detect malicious URLs in real-time. Traditional methods were too slow and often inaccurate. We developed an AI-driven solution to enhance detection capabilities.",
    process: [
      "Data collection of known phishing URLs.",
      "Training machine learning models for pattern recognition.",
      "Developing a real-time scanning API.",
      "Integration with browser extensions."
    ],
    results: [
      { label: "Detection Rate", value: "98%" },
      { label: "Response Time", value: "<100ms" },
      { label: "False Positives", value: "<0.1%" }
    ],
    testimonial: {
      content: "PhishFinder has saved our employees from countless potential security breaches. It's an essential tool for our organization.",
      author: "Michael Chen",
      role: "CISO at SecureNet"
    },
    finalThoughts: "Proactive security is better than reactive. By leveraging AI, we can stay one step ahead of cyber threats."
  },
  {
    id: "nft-marketplace",
    slug: "nft-marketplace",
    title: "NFT Marketplace",
    subtitle: "Digital Asset Trading",
    description: "Full-featured NFT marketplace with custom event indexing using Rindexer and PostgreSQL. Supports minting, listing, bidding, and real-time activity tracking with optimized database queries.",
    tech: ["Solidity", "Rindexer", "PostgreSQL", "React", "IPFS"],
    links: { code: "#", demo: "#" },
    image: "https://picsum.photos/seed/nft/800/600",
    icon: "🎨",
    featured: true,
    client: "ArtBlock",
    location: "London, UK",
    serviceType: "Web3 Platform",
    overview: "ArtBlock wanted to create a niche marketplace for digital artists. They required a platform that could handle high transaction volumes and provide detailed analytics. We built a scalable solution using Rindexer and PostgreSQL.",
    process: [
      "Designing the database schema for efficient querying.",
      "Implementing custom event indexing.",
      "Building the frontend interface for artists and collectors.",
      "Optimizing gas fees for transactions."
    ],
    results: [
      { label: "Trading Volume", value: "$1M+" },
      { label: "Artists Onboarded", value: "200+" },
      { label: "Avg Transaction Time", value: "2s" }
    ],
    testimonial: {
      content: "The analytics provided by the platform are game-changing. We can track trends and optimize our collections like never before.",
      author: "Elena Rodriguez",
      role: "Digital Artist"
    },
    finalThoughts: "The NFT space is evolving. Providing creators with the right tools is essential for the ecosystem's growth."
  },
  {
    id: "grid-fintech",
    slug: "grid-fintech",
    title: "Grid Fintech",
    subtitle: "Multi-Chain Wallet",
    description: "Multi-chain fintech application with wallet import functionality supporting multiple blockchain networks. Features secure key management and seamless cross-chain asset tracking.",
    tech: ["React Native", "Node.js", "Multi-chain", "Web3"],
    links: { code: "#", demo: "#" },
    image: "https://picsum.photos/seed/fintech/800/600",
    icon: "💰",
    featured: true,
    client: "Grid Finance",
    location: "Singapore",
    serviceType: "Fintech Application",
    overview: "Grid Finance needed a mobile-first solution for managing assets across multiple blockchains. Users found it difficult to track their portfolios. We developed a unified interface for seamless asset management.",
    process: [
      "Integrating multiple blockchain APIs.",
      "Developing a secure key management system.",
      "Building a cross-platform mobile app.",
      "Implementing real-time price tracking."
    ],
    results: [
      { label: "Active Wallets", value: "50k+" },
      { label: "Assets Supported", value: "100+" },
      { label: "User Rating", value: "4.8/5" }
    ],
    testimonial: {
      content: "Managing my crypto portfolio has never been easier. The cross-chain support is seamless.",
      author: "David Kim",
      role: "Crypto Investor"
    },
    finalThoughts: "Simplicity is the ultimate sophistication. By abstracting the complexity of blockchain, we make it accessible to everyone."
  }
];
