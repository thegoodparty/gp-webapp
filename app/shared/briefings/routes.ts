/**
 * Canonical paths for the briefings UI. Centralized so layout, TOC,
 * mobile bar, and any future deep links agree on the URL shape.
 *
 * All agenda items render inline on the overview page; per-item navigation
 * is a hash anchor on that same page rather than a sub-route.
 */

export const BRIEFING_EXECUTIVE_SUMMARY_DOM_ID = 'briefing-executive-summary'

/**
 * Canonical jsonPath identifying the Executive Summary card as a whole
 * (not a specific passage inside it). Used as the anchor for card-level
 * notes — `start`/`end` are null in that case.
 */
export const BRIEFING_EXECUTIVE_SUMMARY_CARD_PATH = '/executiveSummary'

export function briefingItemDomId(itemId: string): string {
  return `briefing-item-${itemId}`
}

/**
 * Canonical jsonPath identifying an agenda item card as a whole. A
 * card-level note carries this as its `jsonPath` with `start`/`end` set
 * to null. Inline highlights inside the card keep using path suffixes
 * (`/items/{idx}/title`, `/items/{idx}/display/summary`, etc.).
 */
export function briefingItemCardPath(itemIndex: number): string {
  return `/items/${itemIndex}`
}

export function briefingsLandingHref(): string {
  return '/dashboard/briefings'
}

export function briefingOverviewHref(slug: string): string {
  return `/dashboard/briefings/${slug}`
}

export function briefingItemHref(slug: string, itemId: string): string {
  return `${briefingOverviewHref(slug)}#${briefingItemDomId(itemId)}`
}
