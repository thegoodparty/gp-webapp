import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'
import type { Website } from './types'

export async function fetchUserWebsite(): Promise<Website | null> {
  try {
    const resp = await serverFetch<Website>(apiRoutes.website.get)
    return resp.ok ? resp.data : null
  } catch (e) {
    console.error('error', e)
    return null
  }
}

