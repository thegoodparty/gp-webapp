import { camelToSentence } from 'helpers/stringHelper'
import { AiContentData, Campaign, CampaignAiContent } from './types'

export const AI_CONTENT_SUB_SECTION_KEY = 'aiContent'

const isAiContentData = (
  value: CampaignAiContent[string],
): value is AiContentData =>
  Boolean(
    value &&
      typeof value === 'object' &&
      'name' in value &&
      'content' in value &&
      'updatedAt' in value,
  )

export const buildAiContentSections = (
  campaign: Campaign | null | false = null,
  subSectionKey: string,
): [CampaignAiContent, boolean] => {
  const subsection =
    subSectionKey === AI_CONTENT_SUB_SECTION_KEY && campaign
      ? campaign.aiContent
      : undefined
  const sectionsObj: CampaignAiContent = { ...(subsection || {}) }

  let jobsProcessing = false
  const statusObj = subsection?.generationStatus || {}

  for (const statusKey of Object.keys(statusObj)) {
    const statusEntry = statusObj[statusKey]
    if (statusEntry?.status === 'processing') {
      jobsProcessing = true
      const existingSection = sectionsObj[statusKey]
      const nextSection = isAiContentData(existingSection)
        ? existingSection
        : {
            name: camelToSentence(statusKey),
            content: '',
            updatedAt: Number.NaN,
          }
      sectionsObj[statusKey] = nextSection
    }
  }
  return [sectionsObj, jobsProcessing]
}

