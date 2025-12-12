import { apiRoutes } from 'gpApi/routes'
import { clientFetch, ApiResponse } from 'gpApi/clientFetch'
import { isDomainActive } from './domain.util'
import { NEXT_PUBLIC_CANDIDATES_SITE_BASE } from 'appEnv'

const CANDIDATES_SITE_BASE = NEXT_PUBLIC_CANDIDATES_SITE_BASE

export const WEBSITE_STATUS = {
  published: 'published',
  unpublished: 'unpublished',
}

interface Domain {
  name?: string
  status?: string
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

interface WebsiteIssue {
  title: string
  description: string
}

interface WebsiteContent {
  logo?: string
  theme?: string
  createStep?: string
  main?: {
    title?: string
    tagline?: string
    image?: string
  }
  about?: {
    bio?: string
    issues?: WebsiteIssue[]
    committee?: string
  }
  contact?: {
    address?: string
    email?: string
    phone?: string
  }
  vanityPath?: string
  status?: string
  heroFile?: File | null
}

interface Website {
  id: number
  createdAt: string
  updatedAt: string
  campaignId: number
  status: string
  vanityPath: string
  content: WebsiteContent | null
  domain?: Domain | null
}

export function getWebsiteUrl(
  vanityPath: string,
  preview: boolean = false,
  domain: Domain = {},
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
    const response = await clientFetch<Website>(
      apiRoutes.website.update,
      content as Record<string, unknown>,
    )
    return response
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export async function publishWebsite(): Promise<ApiResponse<Website>> {
  const response: ApiResponse<Website> = await clientFetch(
    apiRoutes.website.update,
    {
      status: WEBSITE_STATUS.published,
    },
  )
  return response
}

export async function unpublishWebsite(): Promise<ApiResponse<Website>> {
  const response: ApiResponse<Website> = await clientFetch(
    apiRoutes.website.update,
    {
      status: WEBSITE_STATUS.unpublished,
    },
  )
  return response
}

export async function validateVanityPath(
  vanityPath: string,
): Promise<ApiResponse<{ valid: boolean }>> {
  const response: ApiResponse<{ valid: boolean }> = await clientFetch(
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
