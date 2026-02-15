const About = () => {
  return (
    <section id="about" className="py-32 px-4 md:px-12 max-w-[1400px] mx-auto reveal">
      <div className="flex items-center gap-6 mb-16">
        <span className="font-mono text-accent">01</span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">About</h2>
        <div className="flex-1 h-px bg-border max-w-[300px]"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-16 items-start">
        <div className="text-lg md:text-xl text-text-secondary space-y-6">
          <p>
            <strong className="text-text-primary">4 years in Web2. 2+ years in Web3.</strong> Specializing in AI-powered applications, full-stack development, smart contracts, and DeFi protocols.
          </p>
          <p>
            I&apos;ve built AI tools, DeFi apps, NFT platforms, and more. I focus on writing clean code that actually works in production.
          </p>
          <p>
            I also create educational blockchain content on emerging tech like privacy, stablecoins, cross-chain protocols, and decentralized AI.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {[
            { number: "4+", label: "Years in Web2" },
            { number: "2+", label: "Years in Web3" },
            { number: "10+", label: "Projects Shipped" },
            { number: "5+", label: "Chains Deployed" },
          ].map((stat, index) => (
            <div key={index} className="p-8 bg-bg-card border border-border hover:border-accent hover:-translate-y-1 transition-all duration-300">
              <div className="font-mono text-4xl font-bold text-accent mb-2">{stat.number}</div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
