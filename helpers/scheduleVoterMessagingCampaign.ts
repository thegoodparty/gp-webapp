import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

interface ScheduleResponse {
  [key: string]: unknown
}

export const scheduleVoterMessagingCampaign = async (
  outreachId: string | number,
  audienceRequest: string | boolean = '',
): Promise<ScheduleResponse | false> => {
  try {
    const resp = await clientFetch<ScheduleResponse>(
      apiRoutes.voters.voterFile.schedule,
      {
        outreachId,
        audienceRequest,
      },
    )
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
