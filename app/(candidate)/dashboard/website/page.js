import pageMetaData from 'helpers/metadataHelper'
import { adminAccessOnly } from 'helpers/permissionHelper'
import WebsitePage from './components/WebsitePage'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import { WebsiteProvider } from './components/WebsiteProvider'

const meta = pageMetaData({
  title: 'Website | GoodParty.org',
  description: 'Website',
  slug: '/dashboard/website',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page() {
  await adminAccessOnly() // TODO: remove this once feature is live

  const [websiteResp, contactsResp] = await Promise.all([
    serverFetch(apiRoutes.website.get),
    serverFetch(apiRoutes.website.getContacts),
  ])

  const website = websiteResp.ok ? websiteResp.data : null
  const contacts = contactsResp.ok ? contactsResp.data : null

  return (
    <WebsiteProvider website={website} contacts={contacts}>
      <WebsitePage pathname="/dashboard/website" />
    </WebsiteProvider>
  )
}
