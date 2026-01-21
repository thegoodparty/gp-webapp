import { camelToSentence } from 'helpers/stringHelper'
import { Campaign } from './types'

export const AI_CONTENT_SUB_SECTION_KEY = 'aiContent'

interface AiContentSection {
  key: string
  name: string
  updatedAt: string | undefined
  status: string
  [key: string]: unknown
}

interface GenerationStatus {
  [key: string]: {
    status: string
    [key: string]: unknown
  }
}

interface SectionsObject {
  generationStatus?: GenerationStatus
  [key: string]: AiContentSection | GenerationStatus | undefined
}

export const buildAiContentSections = (
  campaign: Campaign | Record<string, unknown> | null | false = {},
  subSectionKey: string,
): [SectionsObject, boolean] => {
  const campaignData = campaign as Record<string, unknown>
  const subsection = (campaignData[subSectionKey] as SectionsObject | undefined) || {}
  const sectionsObj: SectionsObject = { ...subsection }

  let jobsProcessing = false
  const statusObj = subsection.generationStatus || {}

  for (const statusKey in statusObj) {
    const statusEntry = statusObj[statusKey]
    if (statusEntry?.status === 'processing') {
      jobsProcessing = true
      const existingSection = sectionsObj[statusKey] as AiContentSection | undefined
      if (!existingSection || existingSection === sectionsObj.generationStatus) {
        sectionsObj[statusKey] = {} as AiContentSection
      }
      sectionsObj[statusKey] = {
        ...(existingSection && existingSection !== sectionsObj.generationStatus ? existingSection : {}),
        key: statusKey,
        name: camelToSentence(statusKey),
        updatedAt: undefined,
        status: 'processing',
      } as AiContentSection
    }
  }
  return [sectionsObj, jobsProcessing]
}

