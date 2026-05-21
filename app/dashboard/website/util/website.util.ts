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

// Module-level promise chain that serializes overlapping `saveAboutFields`
// calls. Without this, two concurrent saves from sibling sections (e.g. bio
// and policy priorities) could each fetch the server state before either
// update lands, then both PUT a merge based on that pre-update snapshot — the
// second write would silently revert the field written by the first.
let saveAboutFieldsQueue: Promise<unknown> = Promise.resolve()

/**
 * Save a partial slice of `website.content.about`.
 *
 * The merge base is always the latest server state (re-fetched here), never a
 * snapshot from the React Query cache, because sibling sections of the app
 * save independent slices of the same `about` object and a stale snapshot
 * would silently overwrite their writes.
 */
export async function saveAboutFields(
  partial: Partial<WebsiteAbout>,
): Promise<boolean> {
  const run = async (): Promise<boolean> => {
    try {
      let latest = await getUserWebsite()
      if (!latest) {
        const createResp = await createWebsite()
        if (!createResp.ok) return false
        latest = createResp.data ?? null
      }
      const result = await updateWebsite({
        about: { ...latest?.content?.about, ...partial },
      })
      return Boolean(result && result.ok)
    } catch (e) {
      console.error('saveAboutFields error', e)
      return false
    }
  }
  const next = saveAboutFieldsQueue.then(run, run)
  saveAboutFieldsQueue = next.catch(() => undefined)
  return next as Promise<boolean>
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
