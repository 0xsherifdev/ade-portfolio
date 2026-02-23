'use client';

import { motion, type Variants } from 'framer-motion';

interface Technology {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
}

interface SkillsProps {
  data?: {
    title?: string | null;
    categories?: Array<{
      category?: string | null;
      items?: (string | Technology)[] | null;
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
      staggerChildren: 0.12,
    },
  },
};

const Skills = ({ data }: SkillsProps) => {
  const title = data?.title || 'Tech Stack';

  const defaultSkills = [
    { category: "Blockchain", items: ["Solidity", "Hardhat", "Foundry", "Ethers.js", "Wagmi", "IPFS", "The Graph"] },
    { category: "Frontend", items: ["React", "Next.js", "TypeScript", "TailwindCSS", "React Native"] },
    { category: "Backend", items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Firebase", "Redis"] },
  ];

  const categories = data?.categories?.length ? data.categories : defaultSkills;

  return (
    <section id="skills" className="py-32 px-4 md:px-12 max-w-[1400px] mx-auto">
      <motion.div
        className="flex items-center gap-6 mb-16"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        <span className="font-mono text-accent">02</span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
        <div className="flex-1 h-px bg-border max-w-[300px]"></div>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {categories.map((skillGroup, index) => {
          const itemNames = (skillGroup.items || []).map((item) =>
            typeof item === 'string' ? item : (item as Technology).name
          );

          return (
            <motion.div
              key={index}
              variants={fadeUp}
              className="p-10 bg-gradient-to-br from-bg-card to-bg-secondary border border-border rounded-xl relative overflow-hidden hover:border-accent hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h3 className="font-mono text-base text-accent mb-7 flex items-center gap-2 tracking-wide before:content-['//'] before:text-text-muted">
                {skillGroup.category}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {itemNames.map((item, i) => (
                  <span key={i} className="font-mono text-xs px-4 py-2 bg-accent/10 text-text-secondary border border-accent/15 rounded-md hover:bg-accent/20 hover:text-accent hover:border-accent transition-all duration-300 cursor-default">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default Skills;
