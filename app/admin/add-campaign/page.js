import { adminAccessOnly } from 'helpers/permissionHelper'
import pageMetaData from 'helpers/metadataHelper'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import { CreateCampaignForm } from '@shared/CreateCampaignForm'

const meta = pageMetaData({
  title: 'Add Campaign| GOOD PARTY',
  description: 'Admin Add a new Campaign',
  slug: '/admin/add-campaign',
})
export const metadata = meta

export default async function Page() {
  await adminAccessOnly()

  const childProps = {
    pathname: '/admin/add-campaign',
    title: 'Add a new Campaign',
  }

  return (
    <AdminWrapper {...childProps}>
      <CreateCampaignForm />
    </AdminWrapper>
  )
}
