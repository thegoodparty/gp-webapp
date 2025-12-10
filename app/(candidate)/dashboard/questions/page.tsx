import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import pageMetaData from 'helpers/metadataHelper'
import candidateAccess from '../shared/candidateAccess'
import QuestionsPage from './components/QuestionsPage'
import {
  serverFetchIssues,
  serverLoadCandidatePosition,
} from 'app/(candidate)/dashboard/campaign-details/components/issues/serverIssuesUtils'

const meta = pageMetaData({
  title: 'Additional Questions | GoodParty.org',
  description: 'Additional Questions',
  slug: '/dashboard/questions',
})
export const metadata = meta

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Record<string, string>
  searchParams: { generate?: string }
}

export default async function Page({ searchParams }: PageProps): Promise<React.JSX.Element> {
  await candidateAccess()
  const { generate } = searchParams

  const campaign = await fetchUserCampaign()
  const candidatePositions = await serverLoadCandidatePosition((campaign as { id: string }).id)
  const topIssues = await serverFetchIssues()

  const childProps = {
    campaign,
    generate,
    candidatePositions,
    topIssues,
  }

  return <QuestionsPage {...childProps} />
}

