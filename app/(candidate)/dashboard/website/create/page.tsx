import pageMetaData from 'helpers/metadataHelper'
import WebsiteCreatePage from './components/WebsiteCreatePage'
import { fetchUserWebsite } from 'helpers/fetchUserWebsite'
import { redirect } from 'next/navigation'
import { WebsiteProvider } from '../components/WebsiteProvider'
import candidateAccess from '../../shared/candidateAccess'
import { combineIssues, WEBSITE_STATUS } from '../util/website.util'
import { serverLoadCandidatePosition } from '../../campaign-details/components/issues/serverIssuesUtils'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'

const meta = pageMetaData({
  title: 'Website Creator | GoodParty.org',
  description: 'Website Creator',
  slug: '/dashboard/website/create',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()
  const campaign = await fetchUserCampaign()

  const website = await fetchUserWebsite()

  if (website && website.status === WEBSITE_STATUS.published) {
    redirect('/dashboard/website/editor')
  }

  if (!campaign) {
    redirect('/run-for-office')
  }

  const issues = await serverLoadCandidatePosition(campaign.id)

  const combinedIssues = combineIssues(issues || [], campaign?.details?.customIssues)

  return (
    <WebsiteProvider website={website} contacts={null}>
      <WebsiteCreatePage
        pathname="/dashboard/website/create"
        initialIssues={combinedIssues}
      />
    </WebsiteProvider>
  )
}
