'use client';

import { motion, type Variants } from 'framer-motion';

interface AboutProps {
  data?: {
    title?: string | null;
    /** Rich text stored as HTML */
    content?: string | null;
    stats?: Array<{
      number?: string | null;
      label?: string | null;
    }> | null;
  };
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const About = ({ data }: AboutProps) => {
  const title = data?.title || 'About';

  const defaultStats = [
    { number: "4+", label: "Years in Web2" },
    { number: "2+", label: "Years in Web3" },
    { number: "10+", label: "Projects Shipped" },
    { number: "5+", label: "Chains Deployed" },
  ];
  const stats = data?.stats?.length ? data.stats : defaultStats;

  return (
    <section id="about" className="py-32 px-4 md:px-12 max-w-[1400px] mx-auto">
      <motion.div
        className="flex items-center gap-6 mb-16"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        <span className="font-mono text-accent">01</span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
        <div className="flex-1 h-px bg-border max-w-[300px]"></div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-16 items-start">
        <motion.div
          className="text-lg md:text-xl text-text-secondary space-y-6 [&_strong]:text-text-primary"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.1 }}
        >
          {data?.content ? (
            <div dangerouslySetInnerHTML={{ __html: data.content }} />
          ) : (
            <>
              <p>
                <strong className="text-text-primary">4 years in Web2. 2+ years in Web3.</strong> Specializing in AI-powered applications, full-stack development, smart contracts, and DeFi protocols.
              </p>
              <p>
                I&apos;ve built AI tools, DeFi apps, NFT platforms, and more. I focus on writing clean code that actually works in production.
              </p>
              <p>
                I also create educational blockchain content on emerging tech like privacy, stablecoins, cross-chain protocols, and decentralized AI.
              </p>
            </>
          )}
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="p-8 bg-bg-card border border-border hover:border-accent hover:-translate-y-1 transition-all duration-300"
            >
              <div className="font-mono text-4xl font-bold text-accent mb-2">{stat.number}</div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
