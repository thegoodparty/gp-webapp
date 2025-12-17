import { notFound, permanentRedirect } from 'next/navigation'
import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import { NEXT_PUBLIC_CANDIDATES_SITE_BASE } from 'appEnv'

interface Website {
  vanityPath: string
}

interface Params {
  vanityPath: string
}

const getWebsite = async ({ vanityPath }: Params): Promise<Website | null> => {
  const resp = await serverFetch<Website>(apiRoutes.website.view, {
    vanityPath,
  })

  return resp.ok ? resp.data : null
}

export const dynamic = 'force-dynamic'

export default async function CandidateWebsitePage({ params }: { params: Promise<Params> }): Promise<null> {
  const website = await getWebsite(await params)

  if (!website) {
    notFound()
  }

  permanentRedirect(`${NEXT_PUBLIC_CANDIDATES_SITE_BASE}/${website.vanityPath}`)

  return null
}
