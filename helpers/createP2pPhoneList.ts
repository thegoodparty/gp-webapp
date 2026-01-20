import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { VoterFileFilters } from 'helpers/types'

export type PhoneListInput = VoterFileFilters & { name?: string }

interface PhoneListResponse {
  token: string
  // <<<<<<< HEAD
  // =======
  //   [key: string]: unknown
  // >>>>>>> origin/develop
}

interface PhoneListStatusResponse {
  phoneListId: number
  leadsLoaded: number
}

export const createP2pPhoneList = async (
  voterFileFilter: PhoneListInput | undefined,
): Promise<PhoneListResponse | false> => {
  try {
    if (!voterFileFilter) {
      console.error('Error creating phone list: voterFileFilter is undefined')
      return false
    }

    const listName = voterFileFilter.name || `P2P Campaign ${Date.now()}`
    const resp = await clientFetch<PhoneListResponse>(
      apiRoutes.p2p.createPhoneList,
      {
        ...voterFileFilter,
        listName,
      },
    )
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

export const getP2pPhoneListStatus = async (
  phoneListToken: string,
): Promise<PhoneListStatusResponse | false> => {
  try {
    const resp = await clientFetch<PhoneListStatusResponse>(
      apiRoutes.p2p.phoneListStatus,
      {
        phoneListToken,
      },
    )
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
