import WebsiteContent from 'app/(candidateWebsite)/c/[vanityPath]/components/WebsiteContent'
import { notFound } from 'next/navigation'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

async function getWebsite({ vanityPath }) {
  const resp = await serverFetch(apiRoutes.website.preview, {
    vanityPath,
  })
  return resp.ok ? resp.data : null
}

export const revalidate = 3600
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Your Website Preview',
  robots: 'noindex',
}

export default async function CandidateWebsitePage({ params }) {
  const website = await getWebsite(await params)

  if (!website) {
    notFound()
  }

  return <WebsiteContent website={website} />
}
