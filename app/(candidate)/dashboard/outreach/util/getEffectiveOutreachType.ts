import { OUTREACH_TYPES } from 'app/(candidate)/dashboard/outreach/constants'
import type { OutreachType } from 'gpApi/outreach.api'

const VALID_OUTREACH_TYPES: readonly string[] = Object.values(OUTREACH_TYPES)

/**
 * Normalizes an outreach type based on p2pUxEnabled flag.
 * When p2pUxEnabled is true and the type is 'text', it returns 'p2p'.
 * Otherwise, it returns the original type.
 * Throws if type is not a valid OutreachType.
 *
 * @param type - The outreach type (e.g., 'text', 'doorKnocking', etc.)
 * @param p2pUxEnabled - Whether the P2P UX feature is enabled
 * @returns A valid OutreachType for API payloads
 */
export const getEffectiveOutreachType = (
  type: string,
  p2pUxEnabled: boolean,
): OutreachType => {
  if (!VALID_OUTREACH_TYPES.includes(type)) {
    throw new Error(`Invalid outreach type: "${type}"`)
  }
  if (p2pUxEnabled && type === OUTREACH_TYPES.text) {
    return OUTREACH_TYPES.p2p
  }
  return type as OutreachType
}

  