import { adminAccessOnly } from 'helpers/permissionHelper'
import AdminPage from './components/AdminPage'
import pageMetaData from 'helpers/metadataHelper'

const meta = pageMetaData({
  title: 'Admin Dashboard',
  description: 'Admin Dashboard.',
})
export const metadata = meta
export const maxDuration = 60

export default async function Page(): Promise<React.JSX.Element> {
  await adminAccessOnly()

  const childProps = {
    pathname: '/admin',
    title: 'Admin Dashboard',
  }
  return <AdminPage {...childProps} />
}
