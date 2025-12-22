import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import pageMetaData from 'helpers/metadataHelper'
import candidateAccess from '../../shared/candidateAccess'
import { getServerUser } from 'helpers/userServerHelper'
import { redirect } from 'next/navigation'
import VoterFileDetailPage from 'app/(candidate)/dashboard/voter-records/[type]/components/VoterFileDetailPage'
import { fetchContentByType } from 'helpers/fetchHelper'
import { setRequiresQuestionsOnTemplates, RequiresQuestionsMap } from 'helpers/setRequiresQuestionsOnTemplates'
import { calcAnswers } from 'app/(candidate)/dashboard/shared/QuestionProgress'
import { serverLoadCandidatePosition } from 'app/(candidate)/dashboard/campaign-details/components/issues/serverIssuesUtils'
import { fetchCanDownload } from '../utils'
const meta = pageMetaData({
  title: 'Voter Data detailed view | GoodParty.org',
  description: 'Voter Data detailed view',
  slug: '/dashboard/voter-records',
})
export const metadata = meta

interface PageParams {
  params: Promise<{ type: string }>
}

export default async function Page({ params }: PageParams): Promise<React.JSX.Element> {
  const { type } = await params
  await candidateAccess()

  const user = await getServerUser() // can be removed when door knocking app is not for admins only
  const campaign = await fetchUserCampaign()
  const canDownload = await fetchCanDownload()
  if (!canDownload) {
    redirect('/dashboard')
  }

  if (!campaign) {
    redirect('/dashboard')
  }

  const candidatePositions = await serverLoadCandidatePosition(campaign.id)

  const { answeredQuestions, totalQuestions } = calcAnswers(
    campaign,
    candidatePositions,
  )

  const hasCompletedQuestions = answeredQuestions >= totalQuestions

  // TODO: Find out why in the world aren't these booleans just being passed along from the entity in Contentful.
  interface AiContentCategory {
    templates?: { key: string }[]
    name?: string
    description?: string
  }
  interface AiContentCategories {
    content?: AiContentCategory[]
  }

  const requiresQuestions: RequiresQuestionsMap = !hasCompletedQuestions
    ? (await fetchContentByType<RequiresQuestionsMap>('contentPromptsQuestions')) || {}
    : {}

  const categoriesData = await fetchContentByType<AiContentCategories>('aiContentCategories')
  const categories = categoriesData?.content?.map((category) => ({
    ...category,
    templates: setRequiresQuestionsOnTemplates(
      category.templates,
      requiresQuestions,
    ),
  }))

  const isCustom = type.startsWith('custom-')

  const childProps = {
    pathname: '/dashboard/voter-records',
    user,
    campaign,
    type,
    isCustom,
    categories,
  }

  return <VoterFileDetailPage {...childProps} />
}
