import pageMetaData from 'helpers/metadataHelper'
import { adminAccessOnly } from 'helpers/permissionHelper'
import AddIssuePage from './components/AddIssuePage'

const meta = pageMetaData({
  title: 'Add Issue | GoodParty.org',
  description: 'Add Issue',
  slug: '/dashboard/issues/add-issue',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

// get the issue id from the url and
export default async function Page() {
  await adminAccessOnly()

  return <AddIssuePage />
}
