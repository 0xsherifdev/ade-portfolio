import { getPayload } from 'payload'
import configPromise from '@payload-config'
import LivePreviewHome from "@/components/LivePreviewHome"

export default async function Home() {
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

  const serverURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return (
    <LivePreviewHome
      initialHome={home}
      initialProjects={projectsData.docs}
      serverURL={serverURL}
    />
  )
}
