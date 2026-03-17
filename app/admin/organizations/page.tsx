import { adminAccessOnly } from 'helpers/permissionHelper'
import AdminOrganizationsPage from './components/AdminOrganizationsPage'
import pageMetaData from 'helpers/metadataHelper'

const meta = pageMetaData({
  title: 'Organizations | GoodParty.org',
  description: 'Admin Organizations Dashboard.',
  slug: '/admin/organizations',
})
export const metadata = meta

export default async function Page(): Promise<React.JSX.Element> {
  await adminAccessOnly()
  return <AdminOrganizationsPage />
}
