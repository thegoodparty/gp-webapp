import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export const createVoterFileFilter = async (filterData) => {
  try {
    const resp = await clientFetch(apiRoutes.voterFileFilter.create, filterData)
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
