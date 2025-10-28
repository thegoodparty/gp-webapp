import { NEXT_PUBLIC_P2P_CUTOFF_DATETIME } from 'appEnv'
import { isInvalidDateObject } from 'helpers/dateHelper'
import { isAfter } from 'date-fns'

export const p2pCutoffDatetime = new Date(NEXT_PUBLIC_P2P_CUTOFF_DATETIME)

if (NEXT_PUBLIC_P2P_CUTOFF_DATETIME && isInvalidDateObject(p2pCutoffDatetime)) {
  throw new Error('NEXT_PUBLIC_P2P_CUTOFF_DATETIME is not a valid date')
}

export const isP2pUxEnabled = (proUpdatedAtDate, tcrCompliant) =>
  tcrCompliant 
// ||
  // !NEXT_PUBLIC_P2P_CUTOFF_DATETIME ||
  // (!isInvalidDateObject(proUpdatedAtDate) &&
  //   isAfter(proUpdatedAtDate, p2pCutoffDatetime))
