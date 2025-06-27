import pageMetaData from 'helpers/metadataHelper'
import { adminAccessOnly } from 'helpers/permissionHelper'
import WebsitePage from './components/WebsitePage'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'

const meta = pageMetaData({
  title: 'Website | GoodParty.org',
  description: 'Website',
  slug: '/dashboard/website',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page() {
  await adminAccessOnly() // TODO: remove this once feature is live

  const resp = await serverFetch(apiRoutes.website.get, {})
  const website = resp.ok ? resp.data : null

  return (
    <WebsitePage pathname="/dashboard/website" preloadedWebsite={website} />
  )
}
