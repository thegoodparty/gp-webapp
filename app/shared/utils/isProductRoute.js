export const isProductRoute = (pathname) => {
  const isOnboardingPath = pathname?.startsWith('/onboarding')
  const isDashboardPath =
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/volunteer-dashboard') ||
    pathname?.startsWith('/product-tour')

  const isProfilePath = pathname?.startsWith('/profile')
  const isServePath = pathname?.startsWith('/serve')

  return Boolean(
    isOnboardingPath || isDashboardPath || isProfilePath || isServePath,
  )
}
