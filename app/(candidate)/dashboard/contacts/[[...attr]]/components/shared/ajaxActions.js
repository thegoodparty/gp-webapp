const { clientFetch } = require('gpApi/clientFetch')
const { apiRoutes } = require('gpApi/routes')

export async function saveCustomSegment(payload) {
  const response = await clientFetch(apiRoutes.segments.create, payload)
  if (response.ok) {
    return response.data
  } else {
    console.error('Failed to create segment', response)
    return false
  }
}

export async function updateCustomSegment(id, payload) {
  const response = await clientFetch(apiRoutes.segments.update, {
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
  const response = await clientFetch(apiRoutes.segments.list)
  return response.data || []
}

export async function deleteCustomSegment(id) {
  return await clientFetch(apiRoutes.segments.delete, { id })
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
