import { Campaign } from 'helpers/types'

export const MIN_BIO_LENGTH = 500
export const MIN_POLICY_FOCUS_LENGTH = 100
export const MIN_POLICY_PRIORITIES = 1

export const isCandidateProfileComplete = (
  campaign: Campaign | null,
): boolean => {
  const whyRunning = campaign?.details?.whyRunning?.trim() ?? ''
  const priorities = campaign?.details?.customIssues ?? []
  return (
    whyRunning.length >= MIN_BIO_LENGTH &&
    priorities.length >= MIN_POLICY_PRIORITIES
  )
}
