import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import ScrollRevealWrapper from "@/components/ScrollRevealWrapper";

export default async function Home() {
  const payload = await getPayload({ config: configPromise })

  const home = await payload.findGlobal({ slug: 'home' })

  const projectsData = await payload.find({
    collection: 'projects',
    where: { featured: { equals: true } },
    limit: 20,
    depth: 2,
  })

  return (
    <ScrollRevealWrapper>
      <main>
        <Hero data={home.hero} />
        <About data={home.about} />
        <Skills data={home.skills} />
        <Projects data={home.projects} projects={projectsData.docs} />
        <Contact data={home.contact} />
      </main>
    </ScrollRevealWrapper>
  );
}
