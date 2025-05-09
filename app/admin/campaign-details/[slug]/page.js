import { adminAccessOnly } from 'helpers/permissionHelper'
import AdminCampaignDetailsPage from './components/AdminCampaignDetailsPage'
import pageMetaData from 'helpers/metadataHelper'
import { fetchCampaignBySlugAdminOnly } from 'app/admin/shared/fetchCampaignBySlugAdminOnly'
import { AdminCampaignProvider } from '@shared/hooks/AdminCampaignProvider'

const meta = pageMetaData({
  title: 'Admin Campaign Details | GoodParty.org',
  description: 'Admin Campaign Details.',
  slug: '/admin/campaign-details',
})
export const metadata = meta
export const maxDuration = 60

export default async function Page({ params }) {
  await adminAccessOnly()
  const { slug } = params
  const campaign = await fetchCampaignBySlugAdminOnly(slug)

  const pathname = '/admin/campaign-details'

  return (
    <AdminCampaignProvider campaign={campaign}>
      <AdminCampaignDetailsPage pathname={pathname} campaign={campaign} />
    </AdminCampaignProvider>
  )
}
