import { Website } from 'helpers/types'

export const MIN_BIO_LENGTH = 500
export const MIN_POLICY_FOCUS_LENGTH = 100
export const MIN_POLICY_PRIORITIES = 1

export const isCandidateProfileComplete = (
  website: Website | null | undefined,
): boolean => {
  const bio = website?.content?.about?.bio?.trim() ?? ''
  const issues = website?.content?.about?.issues ?? []
  return bio.length >= MIN_BIO_LENGTH && issues.length >= MIN_POLICY_PRIORITIES
}
