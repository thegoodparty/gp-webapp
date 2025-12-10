import { adminAccessOnly } from 'helpers/permissionHelper'
import pageMetaData from 'helpers/metadataHelper'
import AdminEcanvasserPage from './components/AdminEcanvasserPage'

const meta = pageMetaData({
  title: 'Ecanvasser | GoodParty.org',
  description: 'Ecanvasser',
  slug: '/admin/ecanvasser',
})
export const metadata = meta
export const maxDuration = 60

export default async function Page(): Promise<React.JSX.Element> {
  await adminAccessOnly()

  return <AdminEcanvasserPage />
}
