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

/**
 * JsonPath of the Executive Summary card's title element. A DOM
 * element under this path is required so card-level chat anchors
 * resolve back to a quote — see ExecutiveSummaryCard.
 */
export const BRIEFING_EXECUTIVE_SUMMARY_TITLE_PATH = '/executive_summary/title'

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

/**
 * JsonPath of an agenda item card's title element. Card-level chats
 * anchor here with `start`/`end` spanning the title's full text — that
 * mirrors what would happen if the user highlighted the title and
 * tapped "Ask AI" themselves.
 */
export function briefingItemTitlePath(itemIndex: number): string {
  return `/items/${itemIndex}/title`
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
