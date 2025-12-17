import pageMetaData from 'helpers/metadataHelper'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import { redirect } from 'next/navigation'
import candidateAccess from '../../shared/candidateAccess'
import DomainPage from './components/DomainPage'
import { WebsiteProvider } from '../components/WebsiteProvider'
import { DomainStatusProvider } from './components/DomainStatusProvider'

const meta = pageMetaData({
  title: 'Add a domain | GoodParty.org',
  description: 'Add a domain',
  slug: '/dashboard/website/domain',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

interface WebsiteContent {
  hero?: {
    headline?: string
    subheadline?: string
  }
  about?: {
    title?: string
    content?: string
  }
  theme?: {
    color?: string
  }
}

interface Website {
  id: number
  vanityPath: string
  status: string
  content: WebsiteContent | null
  domain?: { domain: string; status: string } | null
}

interface DomainStatus {
  status: string
  domain: string
  verificationStatus?: string
}

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()
  const [websiteRes, statusRes] = await Promise.all([
    serverFetch<Website>(apiRoutes.website.get),
    serverFetch<DomainStatus>(apiRoutes.domain.status),
  ])

  const website = websiteRes.ok ? websiteRes.data : null
  const status = statusRes.ok ? statusRes.data : null

  if (!website) {
    redirect('/dashboard/website')
  }

  return (
    <WebsiteProvider website={website} contacts={null}>
      <DomainStatusProvider status={status}>
        <DomainPage pathname="/dashboard/website/domain" />
      </DomainStatusProvider>
    </WebsiteProvider>
  )
}
