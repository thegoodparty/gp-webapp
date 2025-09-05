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
