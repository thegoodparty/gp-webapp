import pageMetaData from 'helpers/metadataHelper'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import { redirect } from 'next/navigation'
import { WebsiteProvider } from '../components/WebsiteProvider'
import candidateAccess from '../../shared/candidateAccess'
import DomainPage from './components/DomainPage'

const meta = pageMetaData({
  title: 'Add a domain | GoodParty.org',
  description: 'Add a domain',
  slug: '/dashboard/website/domain',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page() {
  await candidateAccess()

  const resp = await serverFetch(apiRoutes.website.get, {})
  const website = resp.ok ? resp.data : null

  if (!website) {
    redirect('/dashboard/website')
  }

  return (
    <WebsiteProvider website={website}>
      <DomainPage pathname="/dashboard/website/domain" />
    </WebsiteProvider>
  )
}
