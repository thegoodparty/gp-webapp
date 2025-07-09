import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { serialize } from 'object-to-formdata'

export const WEBSITE_STATUS = {
  published: 'published',
  unpublished: 'unpublished',
}

export function fetchWebsite() {
  return clientFetch(apiRoutes.website.get, {})
}

export function createWebsite() {
  return clientFetch(apiRoutes.website.create, {})
}

export function updateWebsite(content) {
  try {
    const formData = serialize(content, { indices: true })
    return clientFetch(apiRoutes.website.update, formData)
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
