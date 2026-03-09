import { NEXT_PUBLIC_P2P_CUTOFF_DATETIME } from 'appEnv'
import { isInvalidDateObject } from 'helpers/dateHelper'

export const p2pCutoffDatetime = new Date(NEXT_PUBLIC_P2P_CUTOFF_DATETIME || '')

if (NEXT_PUBLIC_P2P_CUTOFF_DATETIME && isInvalidDateObject(p2pCutoffDatetime)) {
  throw new Error('NEXT_PUBLIC_P2P_CUTOFF_DATETIME is not a valid date')
}

// TODO: This is just to turn "on" Peerly texting for all users. Cleanup will be
//  done here: https://goodparty.clickup.com/t/90132012119/ENG-6901
export const isP2pUxEnabled = (
  _proUpdatedAtDate: Date,
  _tcrCompliant: boolean,
): boolean => true
