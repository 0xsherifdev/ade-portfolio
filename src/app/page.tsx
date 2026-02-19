import { getPayload } from 'payload'
import configPromise from '@payload-config'
import LivePreviewHome from "@/components/LivePreviewHome"
import ScrollRevealWrapper from "@/components/ScrollRevealWrapper"
import Hero from "@/components/Hero"
import About from "@/components/About"
import Skills from "@/components/Skills"
import Projects from "@/components/Projects"
import Contact from "@/components/Contact"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const serverURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  try {
    const payload = await getPayload({ config: configPromise })

    const home = await payload.findGlobal({
      slug: 'home',
      depth: 2,
    })

    const projectsData = await payload.find({
      collection: 'projects',
      where: { featured: { equals: true } },
      limit: 20,
      depth: 2,
    })

    return (
      <LivePreviewHome
        initialHome={home}
        initialProjects={projectsData.docs}
        serverURL={serverURL}
      />
    )
  } catch (error) {
    console.error('Failed to fetch from Payload CMS, rendering fallback:', error)
    return (
      <ScrollRevealWrapper>
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
      </ScrollRevealWrapper>
    )
  }
}
