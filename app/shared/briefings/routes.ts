/**
 * Canonical paths for the briefings UI. Centralized so layout, TOC,
 * mobile bar, and any future deep links agree on the URL shape.
 *
 * All agenda items render inline on the overview page; per-item navigation
 * is a hash anchor on that same page rather than a sub-route.
 */

export const BRIEFING_EXECUTIVE_SUMMARY_DOM_ID = 'briefing-executive-summary'

export function briefingItemDomId(itemId: string): string {
  return `briefing-item-${itemId}`
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
