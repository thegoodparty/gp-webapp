import { stripHtml } from 'string-strip-html'
import { Website, WebsiteIssue } from 'helpers/types'

export const MIN_BIO_LENGTH = 500
export const MIN_POLICY_FOCUS_LENGTH = 100
export const MIN_POLICY_PRIORITIES = 1

export const getBioPlainLength = (rawBio: string | undefined | null): number =>
  rawBio ? stripHtml(rawBio).result.trim().length : 0

export const normalizeIssues = (
  raw: { title?: string; description?: string }[] | undefined,
): WebsiteIssue[] =>
  (raw ?? []).map((i) => ({
    title: i.title ?? '',
    description: i.description ?? '',
  }))

export const isCandidateProfileComplete = (
  website: Website | null | undefined,
): boolean => {
  const bioPlainLength = getBioPlainLength(website?.content?.about?.bio)
  const issues = website?.content?.about?.issues ?? []
  return (
    bioPlainLength >= MIN_BIO_LENGTH && issues.length >= MIN_POLICY_PRIORITIES
  )
}
