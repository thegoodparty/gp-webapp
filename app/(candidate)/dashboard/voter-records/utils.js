import { apiRoutes } from 'gpApi/routes'
import { serverFetch } from 'gpApi/serverFetch'

export async function fetchCanDownload() {
  try {
    const resp = await serverFetch(apiRoutes.voters.voterFile.canDownload)
    return resp.data
  } catch (e) {
    console.log('error at fetchCanDownload', e)
    return {}
  }
}
