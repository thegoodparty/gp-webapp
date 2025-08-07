import pageMetaData from 'helpers/metadataHelper'
import WebsiteCreatePage from './components/WebsiteCreatePage'
import { serverFetch } from 'gpApi/serverFetch'
import { apiRoutes } from 'gpApi/routes'
import { redirect } from 'next/navigation'
import { WebsiteProvider } from '../components/WebsiteProvider'
import candidateAccess from '../../shared/candidateAccess'
import { WEBSITE_STATUS } from '../util/website.util'
import { serverLoadCandidatePosition } from '../../campaign-details/components/issues/serverIssuesUtils'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'

const meta = pageMetaData({
  title: 'Website Creator | GoodParty.org',
  description: 'Website Creator',
  slug: '/dashboard/website/create',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

function combineIssues(issues = [], customIssues = []) {
  const mappedIssues = issues.map((issue) => {
    return {
      title: issue.position?.name || '',
      description: issue.description || '',
    }
  })
  const customIssuesWithDescription = customIssues.map((issue) => {
    return {
      title: issue.position?.name || '',
      description: issue.position || '',
    }
  })
  const parsedIssues = [...mappedIssues, ...customIssuesWithDescription]
  return parsedIssues
}

export default async function Page() {
  await candidateAccess()
  const campaign = await fetchUserCampaign()

  const resp = await serverFetch(apiRoutes.website.get)
  const website = resp.ok ? resp.data : null

  if (website && website.status === WEBSITE_STATUS.published) {
    redirect('/dashboard/website/editor')
  }
  const issues = await serverLoadCandidatePosition(campaign.id)

  const combinedIssues = combineIssues(issues, campaign?.details?.customIssues)

  return (
    <WebsiteProvider website={website}>
      <WebsiteCreatePage
        pathname="/dashboard/website/create"
        initialIssues={combinedIssues}
      />
    </WebsiteProvider>
  )
}
