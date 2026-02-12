import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import { fetchContentByType } from 'helpers/fetchHelper'
import pageMetaData from 'helpers/metadataHelper'
import { camelToSentence } from 'helpers/stringHelper'
import candidateAccess from '../../shared/candidateAccess'
import EditContentPage from './components/EditContentPage'

const meta = pageMetaData({
  title: 'Campaign Content | GoodParty.org',
  description: 'Campaign Content',
})
export const metadata = meta

interface PageProps {
  params: { slug: string }
}

interface Prompt {
  key: string
  title: string
}

const parsePrompts = (promptsRaw: Record<string, string>): Prompt[] => {
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

export default async function Page({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { slug } = params
  await candidateAccess()

  const promptsRaw = await fetchContentByType('candidateContentPrompts')
  const prompts = parsePrompts(promptsRaw as Record<string, string>)

  const campaign = await fetchUserCampaign()

  const childProps = {
    slug,
    campaign,
    prompts,
  }

  return <EditContentPage {...childProps} />
}
