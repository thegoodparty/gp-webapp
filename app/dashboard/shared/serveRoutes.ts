/**
 * Route prefixes that make up the elected-official "serve" experience. These
 * pages are gated by `serveAccess` and are scoped to the org that owns the
 * user's elected office, so the post-auth flow must select that org (not the
 * default first org) when landing a user on any of them.
 */
export const SERVE_ROUTE_PREFIXES = [
  '/dashboard/briefings',
  '/dashboard/polls',
] as const

export const isServeRoutePath = (path: string): boolean => {
  // Match on the pathname only — callers may pass a value that still carries a
  // query string or hash (e.g. `/dashboard/polls?tab=open`).
  const pathname = path.split(/[?#]/)[0] ?? path
  return SERVE_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}
