import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { VoterFileFilters } from 'helpers/types'

interface VoterFileFilterResponse extends VoterFileFilters {
  id: string
  name?: string
}

export const createVoterFileFilter = async (
  filterData: Record<string, unknown>,
): Promise<VoterFileFilterResponse | null> => {
  try {
    const resp = await clientFetch<VoterFileFilterResponse>(
      apiRoutes.voterFileFilter.create,
      filterData,
    )
    if (!resp.ok) {
      console.error('Error creating voter file filter:', resp.statusText)
      return null
    }
    return resp.data
  } catch (e) {
    console.error('error creating voter file filter', e)
    return null
  }
}
