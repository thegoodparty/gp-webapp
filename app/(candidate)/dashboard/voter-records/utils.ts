import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

interface CanDownloadResponse {
  canDownload?: boolean
}

export async function fetchCanDownload(): Promise<CanDownloadResponse> {
  try {
    const resp = await serverFetch<CanDownloadResponse>(apiRoutes.voters.voterFile.canDownload)
    return resp.data
  } catch (e) {
    console.log('error at fetchCanDownload', e)
    return {}
  }
}
