import { OUTREACH_TYPES } from 'app/(candidate)/dashboard/outreach/constants'
import type { OutreachType } from 'gpApi/outreach.api'

/**
 * Type guard to check if a value is a valid OutreachType.
 * Useful for runtime validation when converting from broader types (e.g., TASK_TYPES).
 *
 * @param value - The value to check
 * @returns True if the value is a valid OutreachType
 */
export const isValidOutreachType = (value: string): value is OutreachType => {
  return [
    OUTREACH_TYPES.text,
    OUTREACH_TYPES.doorKnocking,
    OUTREACH_TYPES.phoneBanking,
    OUTREACH_TYPES.socialMedia,
    OUTREACH_TYPES.robocall,
    OUTREACH_TYPES.p2p,
  ].includes(value)
}

/**
 * Normalizes an outreach type based on p2pUxEnabled flag.
 * When p2pUxEnabled is true and the type is 'text', it returns 'p2p'.
 * Otherwise, it returns the original type.
 *
 * @param type - The outreach type (e.g., 'text', 'doorKnocking', etc.)
 * @param p2pUxEnabled - Whether the P2P UX feature is enabled
 * @returns A valid OutreachType for API payloads
 */
export const getEffectiveOutreachType = (
  type: OutreachType,
  p2pUxEnabled: boolean,
): OutreachType => {
  if (p2pUxEnabled && type === OUTREACH_TYPES.text) {
    return OUTREACH_TYPES.p2p
  }
  return type
}
