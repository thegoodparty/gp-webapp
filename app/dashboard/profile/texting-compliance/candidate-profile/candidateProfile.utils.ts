import { stripHtml } from 'string-strip-html'
import { Website } from 'helpers/types'

export const MIN_BIO_LENGTH = 500
export const MIN_POLICY_FOCUS_LENGTH = 100
export const MIN_POLICY_PRIORITIES = 1

export const isCandidateProfileComplete = (
  website: Website | null | undefined,
): boolean => {
  const rawBio = website?.content?.about?.bio ?? ''
  const bioPlainLength = rawBio ? stripHtml(rawBio).result.trim().length : 0
  const issues = website?.content?.about?.issues ?? []
  return (
    bioPlainLength >= MIN_BIO_LENGTH && issues.length >= MIN_POLICY_PRIORITIES
  )
}
