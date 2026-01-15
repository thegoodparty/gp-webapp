export const isProductRoute = (pathname: string | null | undefined): boolean => {
  const isOnboardingPath = pathname?.startsWith('/onboarding')
  const isDashboardPath =
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/volunteer-dashboard') ||
    pathname?.startsWith('/product-tour')

  const isProfilePath = pathname?.startsWith('/profile')
  const isServePath = pathname?.startsWith('/polls')

  // Auth-related paths for login/signup experience tracking
  const isAuthPath =
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/sign-up') ||
    pathname?.startsWith('/forgot-password') ||
    pathname?.startsWith('/reset-password') ||
    pathname?.startsWith('/set-password') ||
    pathname?.startsWith('/set-name')

  return Boolean(
    isOnboardingPath ||
      isDashboardPath ||
      isProfilePath ||
      isServePath ||
      isAuthPath,
  )
}

