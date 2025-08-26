import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export const createP2pPhoneList = async (voterFileFilter) => {
  try {
    const resp = await clientFetch(apiRoutes.p2p.createPhoneList, {
      ...voterFileFilter,
      listName: voterFileFilter.name,
    })
    if (!resp.ok) {
      console.error('Error creating phone list:', resp.statusText)
      return false
    }
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}
