import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import { objectToFormData } from 'helpers/formDataHelper'

export function fetchWebsite() {
  return clientFetch(apiRoutes.website.get, {})
}

export function createWebsite() {
  return clientFetch(apiRoutes.website.create, {})
}

function updateWebsite(content) {
  try {
    const formData = objectToFormData(content, ['logoFile', 'heroFile'])
    return clientFetch(apiRoutes.website.update, formData)
  } catch (e) {
    console.error('error', e)
    return false
  }
}
