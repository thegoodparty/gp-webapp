import { fetchContentByType } from 'helpers/fetchHelper'
import pageMetaData from 'helpers/metadataHelper'
import { camelToSentence } from 'helpers/stringHelper'
import candidateAccess from '../shared/candidateAccess'
import ContentPage from './components/ContentPage'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import { getServerUser } from 'helpers/userServerHelper'
import { serverLoadCandidatePosition } from 'app/(candidate)/dashboard/campaign-details/components/issues/serverIssuesUtils'
import HubSpotChatWidgetScript from '@shared/scripts/HubSpotChatWidgetScript'

export const dynamic = 'force-dynamic'

const meta = pageMetaData({
  title: 'Campaign Content | GoodParty.org',
  description: 'Campaign Content',
  slug: '/dashboard/content',
})
export const metadata = meta

interface Category {
  name: string
  templates: { key: string; name: string }[]
}

export default async function Page(): Promise<React.JSX.Element> {
  await candidateAccess()
  const campaign = await fetchUserCampaign()

  const promptsRaw = await fetchContentByType<object>('candidateContentPrompts')
  const prompts = parsePrompts(promptsRaw)

  const requiresQuestions = await fetchContentByType<
    Partial<Record<string, boolean>>
  >('contentPromptsQuestions')

  const categories = await fetchContentByType<Category[]>('aiContentCategories')
  const candidatePositions = campaign
    ? await serverLoadCandidatePosition(campaign.id)
    : false
  const user = await getServerUser() // can be removed when door knocking app is not for admins only

  const childProps = {
    pathname: '/dashboard/content',
    campaign,
    prompts,
    templates: promptsRaw,
    categories,
    pathToVictory: campaign?.pathToVictory?.data,
    requiresQuestions,
    candidatePositions,
    user,
  }

  return (
    <>
      <HubSpotChatWidgetScript />
      <ContentPage {...childProps} />
    </>
  )
}

interface Prompt {
  key: string
  title: string
}

const parsePrompts = (promptsRaw: object): Prompt[] => {
  const keys = Object.keys(promptsRaw)
  const prompts: Prompt[] = []
  keys.forEach((key) => {
    prompts.push({
      key,
      title: camelToSentence(key),
    })
  })
  return prompts
}
