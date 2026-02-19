'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import Hero from "@/components/Hero"
import About from "@/components/About"
import Skills from "@/components/Skills"
import Projects from "@/components/Projects"
import Contact from "@/components/Contact"
import useScrollReveal from "@/hooks/useScrollReveal"

type Props = {
  initialHome: any
  initialProjects: any[]
  serverURL: string
}

export default function LivePreviewHome({ initialHome, initialProjects, serverURL }: Props) {
  useScrollReveal()

  const { data: home } = useLivePreview({
    initialData: initialHome,
    serverURL,
    depth: 2,
  })

  return (
    <main>
      <Hero data={home?.hero} />
      <About data={home?.about} />
      <Skills data={home?.skills} />
      <Projects data={home?.projects} projects={initialProjects} />
      <Contact data={home?.contact} />
    </main>
  )
}
