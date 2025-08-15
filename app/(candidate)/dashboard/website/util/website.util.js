import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { isDomainActive } from './domain.util'
import { NEXT_PUBLIC_CANDIDATES_SITE_BASE } from 'appEnv'

const CANDIDATES_SITE_BASE = NEXT_PUBLIC_CANDIDATES_SITE_BASE

export const WEBSITE_STATUS = {
  published: 'published',
  unpublished: 'unpublished',
}

export function getWebsiteUrl(vanityPath, preview = false, domain = {}) {
  if (domain?.name && isDomainActive(domain)) {
    return `https://${domain.name}`
  }

  return `${CANDIDATES_SITE_BASE}/${vanityPath}${preview ? '/preview' : ''}`
}

export function fetchWebsite() {
  return clientFetch(apiRoutes.website.get, {})
}

export function createWebsite() {
  return clientFetch(apiRoutes.website.create, {})
}

export function updateWebsite(content) {
  try {
    return clientFetch(apiRoutes.website.update, content)
  } catch (e) {
    console.error('error', e)
    return false
  }
}

export function publishWebsite() {
  return clientFetch(apiRoutes.website.update, {
    status: WEBSITE_STATUS.published,
  })
}

export function unpublishWebsite() {
  return clientFetch(apiRoutes.website.update, {
    status: WEBSITE_STATUS.unpublished,
  })
}

export function validateVanityPath(vanityPath) {
  return clientFetch(apiRoutes.website.validateVanityPath, {
    vanityPath,
  })
}

export function combineIssues(issues = [], customIssues = []) {
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
