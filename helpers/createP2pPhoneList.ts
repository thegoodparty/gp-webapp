import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { VoterFileFilters } from 'helpers/types'
import { extractApiErrorInfo } from 'helpers/extractApiErrorInfo'

export type PhoneListInput = VoterFileFilters & { name?: string }

export interface PhoneListResponse {
  token: string
}

export interface PhoneListError {
  message?: string
  errorCode?: string
  status?: number
}

export type PhoneListResult =
  | ({ ok: true } & PhoneListResponse)
  | ({ ok: false } & PhoneListError)

export interface PhoneListStatusResponse {
  phoneListId: number
  leadsLoaded: number
}

export const createP2pPhoneList = async (
  voterFileFilter: PhoneListInput | undefined,
): Promise<PhoneListResult> => {
  try {
    if (!voterFileFilter) {
      console.error('Error creating phone list: voterFileFilter is undefined')
      return { ok: false }
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
      return {
        ok: false,
        status: resp.status,
        ...extractApiErrorInfo(resp.data),
      }
    }
    return { ok: true, ...resp.data }
  } catch (e) {
    console.error('error', e)
    return { ok: false }
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
    // Means the request was accepted but the phone list is still being processed and is not ready yet.
    if (resp.status === 202) {
      return false
    }
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
