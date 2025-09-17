import { DEFAULT_PAGE_SIZE } from './constants'

const { clientFetch } = require('gpApi/clientFetch')
const { apiRoutes } = require('gpApi/routes')

export async function saveCustomSegment(payload) {
  const response = await clientFetch(apiRoutes.voterFileFilter.create, payload)
  if (response.ok) {
    return response.data
  } else {
    console.error('Failed to create segment', response)
    return false
  }
}

export async function updateCustomSegment(id, payload) {
  const response = await clientFetch(apiRoutes.voterFileFilter.update, {
    id,
    ...payload,
  })
  if (response.ok) {
    return response.data
  } else {
    console.error('Failed to update segment', response)
    return false
  }
}

export async function fetchCustomSegments() {
  const response = await clientFetch(apiRoutes.voterFileFilter.list)
  return response.data || []
}

export async function deleteCustomSegment(id) {
  return await clientFetch(apiRoutes.voterFileFilter.delete, { id })
}

export async function fetchContactsCsv(segment) {
  return await clientFetch(
    apiRoutes.contacts.download,
    { segment },
    {
      returnFullResponse: true,
    },
  )
}

export async function fetchContacts({ page, resultsPerPage, segment }) {
  const payload = {
    page: page || 1,
    resultsPerPage: resultsPerPage || DEFAULT_PAGE_SIZE,
    segment: segment || ALL_SEGMENTS,
  }
  const response = await clientFetch(apiRoutes.contacts.list, payload)
  if (response.ok) {
    return response.data || []
  } else {
    console.error('Failed to fetch contacts', response)
    return []
  }
}
