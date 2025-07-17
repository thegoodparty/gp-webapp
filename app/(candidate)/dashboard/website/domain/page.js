import pageMetaData from 'helpers/metadataHelper'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import { redirect } from 'next/navigation'
import candidateAccess from '../../shared/candidateAccess'
import DomainPage from './components/DomainPage'
import { DomainProvider } from './components/DomainProvider'
import { WebsiteProvider } from '../components/WebsiteProvider'
import { DomainStatusProvider } from './components/DomainStatusProvider'

const meta = pageMetaData({
  title: 'Add a domain | GoodParty.org',
  description: 'Add a domain',
  slug: '/dashboard/website/domain',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page() {
  await candidateAccess()
  const [websiteRes, statusRes] = await Promise.all([
    serverFetch(apiRoutes.website.get),
    serverFetch(apiRoutes.domain.status),
  ])

  const website = websiteRes.ok ? websiteRes.data : null
  const status = statusRes.ok ? statusRes.data : null

  if (!website) {
    redirect('/dashboard/website')
  }

  return (
    <WebsiteProvider website={website}>
      <DomainProvider domain={website.domain}>
        <DomainStatusProvider status={status}>
          <DomainPage pathname="/dashboard/website/domain" />
        </DomainStatusProvider>
      </DomainProvider>
    </WebsiteProvider>
  )
}
