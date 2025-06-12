import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export async function scheduleVoterMessagingCampaign(outreachId) {
  try {
    const resp = await clientFetch(apiRoutes.voters.voterFile.schedule, {
      outreachId,
    })
    if (!resp.ok) {
      console.error(
        'Error scheduling voter messaging campaign:',
        resp.statusText,
      )
      return false
    }
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}
