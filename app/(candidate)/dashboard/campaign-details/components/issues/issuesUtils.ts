import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { Campaign, CandidatePosition, CustomIssue } from 'helpers/types'

export interface TopIssue {
  id?: number
  name?: string
}

interface SaveCandidatePositionParams {
  description: string
  campaignId: number
  positionId: number
  topIssueId: number
}

interface CampaignWithCustomIssues {
  details?: {
    customIssues?: CustomIssue[]
  }
}

export const writeCampaignCustomIssue = async (
  existingIndex = -1,
  title: string,
  position: string,
  customIssues: CustomIssue[] = [],
): Promise<CustomIssue[]> => {
  const newCustomIssue: CustomIssue = {
    title,
    position,
  }

  if (existingIndex !== -1) {
    customIssues[existingIndex] = newCustomIssue
  } else {
    customIssues.push(newCustomIssue)
  }
  await updateCampaign([{ key: 'details.customIssues', value: customIssues }])
  return customIssues
}

export const deleteCustomIssue = async (
  index: number,
  customIssues: CustomIssue[] = [],
): Promise<CustomIssue[]> => {
  customIssues.splice(index, 1)
  await updateCampaign([{ key: 'details.customIssues', value: customIssues }])
  return [...customIssues]
}

export const filterIssues = (value = '', issues: TopIssue[]): TopIssue[] => {
  return Array.isArray(issues)
    ? issues.filter((issue) => {
        const name = issue?.name || ''
        return name.toLowerCase().includes(value.toLowerCase())
      })
    : issues
}

export const saveCandidatePosition = async ({
  description,
  campaignId,
  positionId,
  topIssueId,
}: SaveCandidatePositionParams): Promise<CandidatePosition | false> => {
  try {
    const payload = {
      id: campaignId,
      description,
      positionId,
      topIssueId,
      // TODO: remove order once the Sails "input" value for `order` is removed or made optional
      order: 0,
    }
    const resp = await clientFetch<CandidatePosition>(
      apiRoutes.campaign.campaignPosition.create,
      payload,
    )
    return resp.data
  } catch (e) {
    console.log('error at saveCandidatePosition', e)
    return false
  }
}

export const deleteCandidatePosition = async (
  positionId: number,
  campaignId: number,
): Promise<boolean> => {
  try {
    const payload = {
      id: campaignId,
      positionId,
    }
    await clientFetch(apiRoutes.campaign.campaignPosition.delete, payload)
    return true
  } catch (e) {
    console.log('error at deleteCandidatePosition', e)
    return false
  }
}

export async function updateCandidatePosition(
  positionId: number,
  description: string,
  campaignId: number,
): Promise<CandidatePosition | false> {
  try {
    const payload = {
      positionId,
      description,
      id: campaignId,
    }
    const resp = await clientFetch<CandidatePosition>(
      apiRoutes.campaign.campaignPosition.update,
      payload,
    )
    return resp.data
  } catch (e) {
    console.log('error at updateCandidatePosition', e)
    return false
  }
}

export async function loadCandidatePosition(
  campaignId: number,
): Promise<CandidatePosition[] | false> {
  try {
    const payload = {
      id: campaignId,
    }
    const resp = await clientFetch<CandidatePosition[]>(
      apiRoutes.campaign.campaignPosition.find,
      payload,
    )
    return resp.data
  } catch (e) {
    console.log('error at loadCandidatePosition', e)
    return false
  }
}

export const findExistingCustomIssueIndex = (
  campaign: CampaignWithCustomIssues = {},
  issue: CustomIssue | undefined,
  selectIssueCallback: (v: string) => void = () => {},
): number => {
  const customIssues = campaign.details?.customIssues || []
  const index = customIssues.findIndex(
    (customIssue) =>
      customIssue.title === issue?.title &&
      customIssue.position === issue?.position,
  )
  if (index !== -1) {
    selectIssueCallback('custom')
  }
  return index
}

export const handleDeleteCustomIssue = async (
  customIssue: CustomIssue,
  campaign: Campaign,
): Promise<CustomIssue[]> => {
  const existingIndex = findExistingCustomIssueIndex(campaign, customIssue)
  const currentCustomIssues = campaign.details?.customIssues || []
  return existingIndex !== -1
    ? await deleteCustomIssue(existingIndex, currentCustomIssues)
    : [...currentCustomIssues]
}
