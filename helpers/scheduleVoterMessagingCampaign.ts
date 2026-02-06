import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

interface ScheduleResponse {
  [key: string]: unknown
}

export const scheduleVoterMessagingCampaign = async (
  outreachId: string | number,
  audienceRequest: string | boolean = '',
): Promise<ScheduleResponse | false> => {
  const id = Number(outreachId)
  if (!Number.isFinite(id) || id <= 0) {
    console.error('scheduleVoterMessagingCampaign: invalid outreachId', outreachId)
    return false
  }
  try {
    const resp = await clientFetch<ScheduleResponse>(apiRoutes.voters.voterFile.schedule, {
      outreachId: id,
      audienceRequest,
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

