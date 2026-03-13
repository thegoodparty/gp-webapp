import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

export async function fetchCanDownload(): Promise<boolean> {
  try {
    const resp = await serverFetch<boolean>(
      apiRoutes.voters.voterFile.canDownload,
    )
    return resp.data
  } catch (e) {
    console.log('error at fetchCanDownload', e)
    return false
  }
}
