import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

export async function fetchUserWebsite() {
  try {
    const resp = await serverFetch(apiRoutes.website.get)
    return resp.ok ? resp.data : null
  } catch (e) {
    console.error('error', e)
    return null
  }
}

