import { apiRoutes } from 'gpApi/routes'
import { clientFetch, ApiResponse } from 'gpApi/clientFetch'
import { isDomainActive, Domain } from './domain.util'
import { NEXT_PUBLIC_CANDIDATES_SITE_BASE } from 'appEnv'
import type { JsonObject } from 'helpers/jsonTypes'
import type { WebsiteModel as WebsiteEntity } from 'types/prisma-models'

const CANDIDATES_SITE_BASE = NEXT_PUBLIC_CANDIDATES_SITE_BASE as string

export const WEBSITE_STATUS = {
  published: 'published',
  unpublished: 'unpublished',
} as const

export type WebsiteStatus = (typeof WEBSITE_STATUS)[keyof typeof WEBSITE_STATUS]

export function getWebsiteUrl(
  vanityPath: string,
  preview: boolean = false,
  domain: Domain | null | undefined = {},
): string {
  if (domain?.name && isDomainActive(domain)) {
    return `https://${domain.name}`
  }

  return `${CANDIDATES_SITE_BASE}/${vanityPath}${preview ? '/preview' : ''}`
}

export function fetchWebsite(): Promise<ApiResponse<WebsiteEntity>> {
  return clientFetch<WebsiteEntity>(apiRoutes.website.get, {})
}

export function createWebsite(): Promise<ApiResponse<WebsiteEntity>> {
  return clientFetch<WebsiteEntity>(apiRoutes.website.create, {})
}

export function updateWebsite(
  content: JsonObject,
): Promise<false | ApiResponse<WebsiteEntity>> {
  try {
    return clientFetch<WebsiteEntity>(apiRoutes.website.update, content)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('error', e)
    return Promise.resolve(false)
  }
}

export function publishWebsite(): Promise<ApiResponse<WebsiteEntity>> {
  return clientFetch<WebsiteEntity>(apiRoutes.website.update, {
    status: WEBSITE_STATUS.published,
  })
}

export function unpublishWebsite(): Promise<ApiResponse<WebsiteEntity>> {
  return clientFetch<WebsiteEntity>(apiRoutes.website.update, {
    status: WEBSITE_STATUS.unpublished,
  })
}

export interface VanityPathValidation {
  available: boolean
}

export function validateVanityPath(
  vanityPath: string,
): Promise<ApiResponse<VanityPathValidation>> {
  return clientFetch<VanityPathValidation>(apiRoutes.website.validateVanityPath, {
    vanityPath,
  })
}

type FlexibleObject = { [key: string]: string | number | boolean | object | null | undefined }

export interface CombinedIssue extends FlexibleObject {
  title: string
  description: string
}

export interface IssueItem {
  position?: { name?: string }
  description?: string
}

export interface CustomIssueItem {
  title?: string
  position?: string
}

export function combineIssues(
  issues: IssueItem[] = [],
  customIssues: CustomIssueItem[] = [],
): CombinedIssue[] {
  const mappedIssues: CombinedIssue[] = issues.map((issue) => {
    return {
      title: issue.position?.name || '',
      description: issue.description || '',
    }
  })
  const customIssuesWithDescription: CombinedIssue[] = customIssues.map((issue) => {
    return {
      title: issue.title || '',
      description: issue.position || '',
    }
  })
  const parsedIssues = [...mappedIssues, ...customIssuesWithDescription]
  return parsedIssues
}
