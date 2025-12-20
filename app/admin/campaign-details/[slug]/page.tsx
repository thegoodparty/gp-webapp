import { adminAccessOnly } from 'helpers/permissionHelper'
import AdminCampaignDetailsPage from './components/AdminCampaignDetailsPage'
import pageMetaData from 'helpers/metadataHelper'
import { fetchCampaignBySlugAdminOnly } from 'app/admin/shared/fetchCampaignBySlugAdminOnly'
import { AdminCampaignProvider } from '@shared/hooks/AdminCampaignProvider'
import { Params } from 'next/dist/server/request/params'

const meta = pageMetaData({
  title: 'Admin Campaign Details | GoodParty.org',
  description: 'Admin Campaign Details.',
  slug: '/admin/campaign-details',
})
export const metadata = meta
export const maxDuration = 60

export default async function Page({
  params,
}: {
  params: Params
}): Promise<React.JSX.Element | null> {
  await adminAccessOnly()
  const resolvedParams = await params
  const slug = resolvedParams.slug
  if (!slug || Array.isArray(slug)) {
    return null
  }
  const campaign = await fetchCampaignBySlugAdminOnly(slug)
  if (!campaign) {
    return null
  }

  const pathname = '/admin/campaign-details'

  return (
    <AdminCampaignProvider campaign={campaign}>
      <AdminCampaignDetailsPage pathname={pathname} />
    </AdminCampaignProvider>
  )
}
