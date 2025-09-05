import { NEXT_PUBLIC_P2P_CUTOFF_DATETIME } from 'appEnv'
import { isInvalidDateObject } from 'helpers/dateHelper'
import { isBefore } from 'date-fns'

export const p2pCutoffDatetime = new Date(NEXT_PUBLIC_P2P_CUTOFF_DATETIME)

if (NEXT_PUBLIC_P2P_CUTOFF_DATETIME && isInvalidDateObject(p2pCutoffDatetime)) {
  throw new Error('NEXT_PUBLIC_P2P_CUTOFF_DATETIME is not a valid date')
}

export const isP2pUxEnabled = (proUpdatedAtDate) =>
  !NEXT_PUBLIC_P2P_CUTOFF_DATETIME ||
  (!isInvalidDateObject(proUpdatedAtDate) &&
    isBefore(proUpdatedAtDate, p2pCutoffDatetime))
