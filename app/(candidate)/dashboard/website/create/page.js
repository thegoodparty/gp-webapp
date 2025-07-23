import pageMetaData from 'helpers/metadataHelper'
import WebsiteCreatePage from './components/WebsiteCreatePage'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import { redirect } from 'next/navigation'
import { WebsiteProvider } from '../components/WebsiteProvider'
import candidateAccess from '../../shared/candidateAccess'

const meta = pageMetaData({
  title: 'Website Creator | GoodParty.org',
  description: 'Website Creator',
  slug: '/dashboard/website/create',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page() {
  await candidateAccess()

  const resp = await serverFetch(apiRoutes.website.get)
  const website = resp.ok ? resp.data : null

  if (website) {
    redirect('/dashboard/website/editor')
  }

  return (
    <WebsiteProvider website={website}>
      <WebsiteCreatePage pathname="/dashboard/website/create" />
    </WebsiteProvider>
  )
}
