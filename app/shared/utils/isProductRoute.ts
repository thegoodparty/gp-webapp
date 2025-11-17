export const isProductRoute = (pathname: string | null | undefined): boolean => {
  const isOnboardingPath = pathname?.startsWith('/onboarding')
  const isDashboardPath =
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/volunteer-dashboard') ||
    pathname?.startsWith('/product-tour')

  const isProfilePath = pathname?.startsWith('/profile')
  const isServePath = pathname?.startsWith('/polls')

  return Boolean(
    isOnboardingPath || isDashboardPath || isProfilePath || isServePath,
  )
}

