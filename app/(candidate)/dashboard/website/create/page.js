import pageMetaData from 'helpers/metadataHelper'
import { adminAccessOnly } from 'helpers/permissionHelper'
import WebsiteCreatePage from './components/WebsiteCreatePage'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import { redirect } from 'next/navigation'
import { WebsiteProvider } from '../components/WebsiteProvider'

const meta = pageMetaData({
  title: 'Website Editor | GoodParty.org',
  description: 'Website Editor',
  slug: '/dashboard/website/editor',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page() {
  await adminAccessOnly() // TODO: remove this once feature is live

  const resp = await serverFetch(apiRoutes.website.get, {})
  const website = resp.ok ? resp.data : null

  if (!website) {
    redirect('/dashboard/website')
  }

  return (
    <WebsiteProvider website={website}>
      <WebsiteCreatePage pathname="/dashboard/website/create" />
    </WebsiteProvider>
  )
}
