import { isProductRoute } from './isProductRoute'

/**
 * Routes that should have Session Replay enabled.
 * This includes product routes (onboarding, dashboard, etc.)
 * AND authentication routes (login, sign-up, password reset, etc.)
 * to help diagnose auth-related user issues.
 */
const AUTH_ROUTES = [
  '/login',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
  '/set-password',
  '/set-name',
]

export const isSessionReplayRoute = (
  pathname: string | null | undefined,
): boolean => {
  if (isProductRoute(pathname)) {
    return true
  }

  return AUTH_ROUTES.some((route) => pathname?.startsWith(route))
}
