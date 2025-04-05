import { canCreateCampaigns } from 'helpers/permissionHelper'
import pageMetaData from 'helpers/metadataHelper'
import { CreateCampaignForm } from '@shared/CreateCampaignForm'

const meta = pageMetaData({
  title: 'Add Campaign| GOOD PARTY',
  description: 'Admin Add a new Campaign',
  slug: '/sales/add-campaign',
})
export const metadata = meta

export default async function Page({ searchParams }) {
  await canCreateCampaigns()

  return <CreateCampaignForm />
}
