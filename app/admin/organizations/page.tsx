import { adminAccessOnly } from 'helpers/permissionHelper'
import { AdminOrganizationsPage } from './components/AdminOrganizationsPage'
import pageMetaData from 'helpers/metadataHelper'

export const metadata = pageMetaData({
  title: 'Organizations | GoodParty.org',
  description: 'Admin Organizations Dashboard',
  slug: '/admin/organizations',
})

export default async function Page(): Promise<React.JSX.Element> {
  await adminAccessOnly()
  return <AdminOrganizationsPage />
}
