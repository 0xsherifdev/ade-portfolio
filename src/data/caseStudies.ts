export interface CaseStudyStat {
  value: string;
  label: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  location: string;
  serviceType: string;
  icon: string;
  overview: string[];
  process: {
    intro: string;
    steps: string[];
    summary: string;
  };
  results: {
    summary: string;
    stats: CaseStudyStat[];
  };
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
  finalThoughts: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "arcade",
    title: "Revolutionizing AI Agent Access",
    subtitle:
      "Built a decentralized AI agent rental marketplace on Arc blockchain, enabling seamless agent discovery and monetization.",
    client: "Arcade Platform",
    location: "San Francisco, USA",
    serviceType: "Blockchain Marketplace Development",
    icon: "🎮",
    overview: [
      "Arcade needed a fully decentralized marketplace where AI agent providers could list, rent, and monetize their agents on-chain. The existing solutions were centralized, lacked transparency in earnings tracking, and couldn't guarantee uptime or fair pricing. The challenge was to build a trustless system with smart contract-powered rentals, IPFS-based metadata, and real-time earnings visibility.",
      "We designed and deployed a comprehensive smart contract infrastructure on Arc blockchain that handles agent listings, rental agreements, platform fee distribution, and provider payouts — all without intermediaries. The system integrates with IPFS for decentralized metadata storage and provides a React-based frontend for seamless user interactions.",
    ],
    process: {
      intro:
        "We built the marketplace through a systematic blockchain-first approach:",
      steps: [
        "Architecting smart contracts for agent listing, rental lifecycle, and automated payout distribution with configurable platform fees.",
        "Implementing IPFS integration for agent metadata storage, ensuring data persistence and decentralization beyond the blockchain layer.",
        "Building a React frontend with Ethers.js for wallet connectivity, real-time contract event listening, and responsive agent browsing.",
        "Deploying and testing on Arc Network with comprehensive unit tests, gas optimization, and security audit preparation.",
      ],
      summary:
        "This architecture ensures full transparency — every rental, payment, and agent update is verifiable on-chain while maintaining a smooth user experience.",
    },
    results: {
      summary:
        "Within three months of launch, the marketplace attracted significant traction with growing provider adoption and rental volume.",
      stats: [
        { value: "+200%", label: "Provider Growth" },
        { value: "+150%", label: "Monthly Rentals" },
        { value: "+95%", label: "Uptime Score" },
      ],
    },
    testimonial: {
      quote:
        "The marketplace completely changed how we think about AI agent distribution. Having everything on-chain means full transparency and trust for both providers and renters.",
      author: "Marcus Chen",
      role: "Lead Developer at Arcade Platform",
    },
    finalThoughts:
      "Decentralization brings accountability. By putting every transaction on-chain, Arcade created a marketplace where trust is built into the protocol, not dependent on a central authority.",
  },
  {
    slug: "phishfinder",
    title: "Boosting Digital Security",
    subtitle:
      "Developed an AI-powered phishing detection system that identifies malicious URLs in real-time to protect users from cyber threats.",
    client: "PhishFinder Security",
    location: "London, UK",
    serviceType: "AI Security Tool Development",
    icon: "🎣",
    overview: [
      "PhishFinder Security needed a solution to combat the rising tide of sophisticated phishing attacks. Traditional blacklist-based approaches were too slow — new phishing URLs appeared faster than databases could update. The challenge was building a system that could analyze and classify URLs in real-time using machine learning, without relying on known threat databases.",
      "We built an AI-powered detection engine using Python and Flask that analyzes URL structure, domain patterns, SSL certificates, and page content to classify threats. The system uses a trained ML model that continuously improves its accuracy, catching zero-day phishing attempts that traditional tools miss entirely.",
    ],
    process: {
      intro:
        "We developed the detection system through a data-driven ML pipeline:",
      steps: [
        "Collecting and curating a dataset of 50,000+ labeled URLs — both legitimate and phishing — from multiple threat intelligence sources.",
        "Engineering features from URL structure, domain age, SSL status, redirect chains, and content similarity to known phishing templates.",
        "Training and optimizing a gradient-boosted classification model with cross-validation, achieving 97.3% accuracy on holdout test data.",
        "Deploying as a Flask API with a clean web interface for real-time URL scanning and threat reporting.",
      ],
      summary:
        "The result is a detection system that catches threats in milliseconds, far faster than manual review or blacklist updates.",
    },
    results: {
      summary:
        "After deployment, PhishFinder dramatically improved threat detection rates and response times for its user base.",
      stats: [
        { value: "+300%", label: "Lead Conversion" },
        { value: "+200%", label: "Website Traffic" },
        { value: "97.3%", label: "Detection Rate" },
      ],
    },
    testimonial: {
      quote:
        "PhishFinder catches threats we didn't even know existed. The real-time analysis gives our users confidence that every link they click has been vetted by AI.",
      author: "Sarah Mitchell",
      role: "Security Director at PhishFinder",
    },
    finalThoughts:
      "Security must be proactive, not reactive. By leveraging machine learning, PhishFinder stays ahead of attackers instead of chasing them — protecting users before damage is done.",
  },
  {
    slug: "nft-marketplace",
    title: "Rebuilding Digital Asset Trading",
    subtitle:
      "Optimized marketplace infrastructure to enhance trading performance and strengthen asset management strategies more consistently.",
    client: "Nexus Digital",
    location: "Tokyo, Japan",
    serviceType: "NFT Platform Architecture",
    icon: "🎨",
    overview: [
      "Nexus Digital needed a next-generation NFT marketplace that could handle high-volume trading without the performance bottlenecks common in on-chain applications. Their existing platform suffered from slow event indexing, poor search performance, and unreliable activity feeds. The challenge was building a system that combined on-chain security with off-chain performance.",
      "We architected a full-stack solution using custom event indexing with Rindexer and PostgreSQL, enabling real-time activity tracking and lightning-fast queries. The smart contracts handle minting, listing, bidding, and royalty distribution, while the indexer ensures all on-chain events are instantly searchable and filterable.",
    ],
    process: {
      intro:
        "We rebuilt the marketplace infrastructure from the ground up:",
      steps: [
        "Designing Solidity smart contracts for minting, listing, auction bidding, and configurable royalty distribution with gas-optimized patterns.",
        "Setting up Rindexer to capture and process smart contract events into PostgreSQL with custom indexing strategies for optimal query performance.",
        "Building optimized database schemas with materialized views for activity feeds, collection stats, and trending asset calculations.",
        "Integrating IPFS for decentralized asset and metadata storage with pinning services for persistence guarantees.",
      ],
      summary:
        "The hybrid architecture delivers sub-100ms query times for marketplace data while maintaining full on-chain security for all transactions.",
    },
    results: {
      summary:
        "The rebuilt infrastructure transformed marketplace performance and enabled features that were previously impossible at scale.",
      stats: [
        { value: "+310%", label: "ROI Increase" },
        { value: "+180%", label: "Qualified Leads" },
        { value: "< 100ms", label: "Query Speed" },
      ],
    },
    testimonial: {
      quote:
        "Our marketplace went from sluggish to instant. The custom indexing solution means our users see activity in real-time, and our search is finally competitive with centralized platforms.",
      author: "Yuki Tanaka",
      role: "CTO at Nexus Digital",
    },
    finalThoughts:
      "Performance is a feature. By combining on-chain security with optimized off-chain indexing, Nexus proved that decentralized marketplaces can match — and exceed — the speed of centralized alternatives.",
  },
  {
    slug: "grid-fintech",
    title: "Optimizing Cross-Chain Finance",
    subtitle:
      "Implemented data-led insights to improve growth and drive long-term sustainable cross-chain financial operations.",
    client: "Grid Financial",
    location: "Berlin, Germany",
    serviceType: "Multi-Chain Fintech Development",
    icon: "💰",
    overview: [
      "Grid Financial approached us to solve the fragmentation problem in multi-chain asset management. Their users needed to import wallets across multiple blockchain networks, track assets in real-time, and manage portfolio allocations — all from a single mobile application. The existing solution required switching between different apps for each chain, creating a disjointed and error-prone experience.",
      "We built a React Native mobile application with secure key management that supports wallet import across multiple blockchain networks. The app features a unified dashboard for cross-chain asset tracking, real-time price feeds, and portfolio analytics — giving users complete visibility into their decentralized holdings.",
    ],
    process: {
      intro:
        "We developed the multi-chain fintech app through a security-first approach:",
      steps: [
        "Implementing secure key derivation and storage using platform-native encryption with biometric authentication support.",
        "Building chain-specific wallet adapters for EVM, Solana, and UTXO-based networks with unified transaction interfaces.",
        "Creating a real-time portfolio dashboard with cross-chain aggregation, historical tracking, and customizable alerts.",
        "Designing an intuitive mobile UX with Node.js backend APIs for price feeds, transaction history, and push notifications.",
      ],
      summary:
        "The unified architecture eliminates chain-switching friction, letting users manage all their crypto assets from a single, secure interface.",
    },
    results: {
      summary:
        "Within five months, the app saw strong adoption with users consolidating their multi-chain management into a single platform.",
      stats: [
        { value: "+45%", label: "Retention Growth" },
        { value: "+60%", label: "User Referrals" },
        { value: "+80%", label: "Asset Volume" },
      ],
    },
    testimonial: {
      quote:
        "We finally have one place for everything. Grid made cross-chain management feel effortless — our users don't even think about which chain they're on anymore.",
      author: "Lukas Weber",
      role: "Product Lead at Grid Financial",
    },
    finalThoughts:
      "Simplicity drives adoption. By abstracting chain complexity behind an intuitive interface, Grid turned multi-chain management from a power-user skill into an everyday experience.",
  },
];
