import pageMetaData from 'helpers/metadataHelper'
import { fetchUserWebsite } from 'helpers/fetchUserWebsite'
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

export default async function Page() {
  await candidateAccess()
  const [website, statusRes] = await Promise.all([
    fetchUserWebsite(),
    serverFetch(apiRoutes.domain.status),
  ])

  const status = statusRes.ok ? statusRes.data : null

  if (!website) {
    redirect('/dashboard/website')
  }

  return (
    <WebsiteProvider website={website}>
      <DomainStatusProvider status={status}>
        <DomainPage pathname="/dashboard/website/domain" />
      </DomainStatusProvider>
    </WebsiteProvider>
  )
}
