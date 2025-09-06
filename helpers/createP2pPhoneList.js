import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'

export const createP2pPhoneList = async (voterFileFilter) => {
  try {
    if (!voterFileFilter) {
      console.error('Error creating phone list: voterFileFilter is undefined')
      return false
    }
    
    const listName = voterFileFilter.name || `P2P Campaign ${Date.now()}`
    const resp = await clientFetch(apiRoutes.p2p.createPhoneList, {
      ...voterFileFilter,
      listName,
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

export const getP2pPhoneListStatus = async (phoneListToken) => {
  try {
    const resp = await clientFetch(apiRoutes.p2p.phoneListStatus, {
      phoneListToken,
    })
    if (!resp.ok) {
      console.error('Error fetching phone list status:', resp.statusText)
      return false
    }
    return resp.data
  } catch (e) {
    console.error('error', e)
    return false
  }
}
