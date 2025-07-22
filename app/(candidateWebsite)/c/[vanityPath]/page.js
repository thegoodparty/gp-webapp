import WebsiteContent from './components/WebsiteContent'
import WebsiteViewTracker from './components/WebsiteViewTracker'
import { notFound } from 'next/navigation'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

async function getWebsite({ vanityPath }) {
  const resp = await serverFetch(apiRoutes.website.view, {
    vanityPath,
  })
  return resp.ok ? resp.data : null
}

export const revalidate = 3600
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const website = await getWebsite(await params)

  if (!website) {
    notFound()
  }

  return {
    title: `${website.content?.main?.title}`,
    description: website.content?.main?.tagline,
    other: {
      isCandidateWebsite: true,
    },
  }
}

export default async function CandidateWebsitePage({ params }) {
  const website = await getWebsite(await params)

  if (!website) {
    notFound()
  }

  return (
    <>
      <WebsiteViewTracker vanityPath={website.vanityPath} />
      <WebsiteContent website={website} />
    </>
  )
}
