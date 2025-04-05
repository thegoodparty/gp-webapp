import { adminAccessOnly } from 'helpers/permissionHelper'
import AdminVictoryPathPage from './components/AdminVictoryPathPage'
import pageMetaData from 'helpers/metadataHelper'
import { fetchCampaignBySlugAdminOnly } from 'app/admin/shared/fetchCampaignBySlugAdminOnly'
import { AdminCampaignProvider } from '@shared/hooks/AdminCampaignProvider'

const meta = pageMetaData({
  title: 'Admin Path to Victory | GoodParty.org',
  description: 'Admin Path to Victory.',
  slug: '/admin/victory-path',
})
export const metadata = meta
export const maxDuration = 60

export default async function Page({ params }) {
  await adminAccessOnly()
  const { slug } = params
  const campaign = await fetchCampaignBySlugAdminOnly(slug)

  const childProps = {
    pathname: '/admin/candidates',
    title: 'Path to Victory',
    campaign,
  }
  return (
    <AdminCampaignProvider campaign={campaign}>
      <AdminVictoryPathPage {...childProps} />
    </AdminCampaignProvider>
  )
}
