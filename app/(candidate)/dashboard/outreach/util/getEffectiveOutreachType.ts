import { OUTREACH_TYPES } from "app/(candidate)/dashboard/outreach/constants"

/**
 * Normalizes an outreach type based on p2pUxEnabled flag.
 * When p2pUxEnabled is true and the type is 'text', it returns 'p2p'.
 * Otherwise, it returns the original type.
 *
 * This centralizes the logic for converting 'text' to 'p2p' when the P2P UX is enabled,
 * ensuring consistency across the codebase.
 *
 * @param type - The outreach type (e.g., 'text', 'doorKnocking', etc.)
 * @param p2pUxEnabled - Whether the P2P UX feature is enabled
 * @returns The normalized outreach type
 */
export const getEffectiveOutreachType = (
    type: string,
    p2pUxEnabled: boolean,
  ): string => {
    if (p2pUxEnabled && type === OUTREACH_TYPES.text) {
      return OUTREACH_TYPES.p2p
    }
    return type
  }
  