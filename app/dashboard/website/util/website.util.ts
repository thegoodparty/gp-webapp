import { apiRoutes } from 'gpApi/routes'
import { clientFetch, ApiResponse } from 'gpApi/clientFetch'
import { isDomainActive } from './domain.util'
import { NEXT_PUBLIC_CANDIDATES_SITE_BASE } from 'appEnv'
import type { Website, WebsiteContent, Domain } from 'helpers/types'

type WebsiteAbout = NonNullable<WebsiteContent['about']>

const CANDIDATES_SITE_BASE = NEXT_PUBLIC_CANDIDATES_SITE_BASE

export const WEBSITE_STATUS = {
  published: 'published',
  unpublished: 'unpublished',
}
interface Issue {
  position?: {
    name?: string
  }
  description?: string
}

interface CustomIssue {
  title?: string
  position?: string
}

interface CombinedIssue {
  title: string
  description: string
}

export function getWebsiteUrl(
  vanityPath: string,
  preview: boolean = false,
  domain?: Domain | null,
): string {
  if (domain?.name && isDomainActive(domain)) {
    return `https://${domain.name}`
  }

  return `${CANDIDATES_SITE_BASE}/${vanityPath}${preview ? '/preview' : ''}`
}

export async function createWebsite(): Promise<ApiResponse<Website>> {
  const response: ApiResponse<Website> = await clientFetch(
    apiRoutes.website.create,
    {},
  )
  return response
}

export async function updateWebsite(
  content: WebsiteContent,
): Promise<ApiResponse<Website> | false> {
  try {
    return await clientFetch<Website, WebsiteContent>(
      apiRoutes.website.update,
      content,
    )
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export const USER_WEBSITE_QUERY_KEY = ['user-website']

export async function getUserWebsite(): Promise<Website | null> {
  try {
    const resp = await clientFetch<Website>(apiRoutes.website.get)
    return resp.ok ? resp.data : null
  } catch (e) {
    console.error('error', e)
    return null
  }
}

export async function saveAboutFields(
  partial: Partial<WebsiteAbout>,
  existing: Website | null | undefined,
): Promise<boolean> {
  try {
    if (!existing) {
      const createResp = await createWebsite()
      if (!createResp.ok) return false
    }
    const result = await updateWebsite({
      about: { ...existing?.content?.about, ...partial },
    })
    return Boolean(result && result.ok)
  } catch (e) {
    console.error('saveAboutFields error', e)
    return false
  }
}

export async function validateVanityPath(
  vanityPath: string,
): Promise<ApiResponse<{ available: boolean }>> {
  const response: ApiResponse<{ available: boolean }> = await clientFetch(
    apiRoutes.website.validateVanityPath,
    {
      vanityPath,
    },
  )
  return response
}

export function combineIssues(
  issues: Issue[] = [],
  customIssues: CustomIssue[] = [],
): CombinedIssue[] {
  const mappedIssues = issues.map((issue) => {
    return {
      title: issue.position?.name || '',
      description: issue.description || '',
    }
  })
  const customIssuesWithDescription = customIssues.map((issue) => {
    return {
      title: issue.title || '',
      description: issue.position || '',
    }
  })
  const parsedIssues = [...mappedIssues, ...customIssuesWithDescription]
  return parsedIssues
}
