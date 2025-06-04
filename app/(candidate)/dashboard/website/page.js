import pageMetaData from 'helpers/metadataHelper'
import { adminAccessOnly } from 'helpers/permissionHelper'
import WebsitePage from './components/WebsitePage'

const meta = pageMetaData({
  title: 'Website | GoodParty.org',
  description: 'Website',
  slug: '/dashboard/website',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page() {
  await adminAccessOnly()

  return <WebsitePage pathname="/dashboard/website" />
}
