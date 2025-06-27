import WebsiteContent from 'app/(candidate)/dashboard/website/editor/components/WebsiteContent'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import { notFound } from 'next/navigation'

export const revalidate = 3600
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { vanityPath } = await params
  const resp = await serverFetch(apiRoutes.website.preview, {
    vanityPath,
  })
  const website = resp.ok ? resp.data : null

  if (!website) {
    notFound()
  }

  return {
    title: `${website.content?.main?.title} | GoodParty.org`,
    description: website.content?.main?.tagline,
  }
}

export default async function CandidateWebsitePage({ params }) {
  const { vanityPath } = await params
  const resp = await serverFetch(apiRoutes.website.preview, {
    vanityPath,
  })
  const website = resp.ok ? resp.data : null

  if (!website) {
    notFound()
  }

  return <WebsiteContent website={website} />
}
