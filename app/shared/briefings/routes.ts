/**
 * Canonical paths for the briefings UI. Centralized so layout, TOC,
 * mobile bar, and any future deep links agree on the URL shape.
 */

export function briefingsLandingHref(): string {
  return '/dashboard/briefings'
}

export function briefingOverviewHref(slug: string): string {
  return `/dashboard/briefings/${slug}`
}

export function briefingItemHref(slug: string, itemId: string): string {
  return `/dashboard/briefings/${slug}/${itemId}`
}
