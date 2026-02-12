import { adminAccessOnly } from 'helpers/permissionHelper'
import AdminVictoryPathPage from './components/AdminVictoryPathPage'
import pageMetaData from 'helpers/metadataHelper'
import { fetchCampaignBySlugAdminOnly } from 'app/admin/shared/fetchCampaignBySlugAdminOnly'
import { AdminCampaignProvider } from '@shared/hooks/AdminCampaignProvider'
import { Campaign } from 'helpers/types'

const meta = pageMetaData({
  title: 'Admin Path to Victory | GoodParty.org',
  description: 'Admin Path to Victory.',
  slug: '/admin/victory-path',
})
export const metadata = meta
export const maxDuration = 60

interface PageProps {
  params: { slug: string }
}

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  await adminAccessOnly()
  const { slug } = params
  const fetchedCampaign = (await fetchCampaignBySlugAdminOnly(slug)) as Campaign

  const childProps = {
    pathname: '/admin/candidates',
    title: 'Path to Victory',
    campaign: fetchedCampaign,
  }
  return (
    <AdminCampaignProvider campaign={fetchedCampaign}>
      <AdminVictoryPathPage {...childProps} />
    </AdminCampaignProvider>
  )
}
