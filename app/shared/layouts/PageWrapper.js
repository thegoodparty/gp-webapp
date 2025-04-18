import Snackbar from '@shared/utils/Snackbar'
import { Suspense } from 'react'
import Footer from 'app/shared/layouts/footer/Footer'
import JsonLdSchema from './JsonLdSchema'
import Nav from './navigation/Nav'
import CookiesSnackbar from './CookiesSnackbar'
import { NavigationProvider } from '@shared/layouts/navigation/NavigationProvider'
import { UserProvider } from '@shared/user/UserProvider'
import { CampaignStatusProvider } from '@shared/user/CampaignStatusProvider'
import { CampaignProvider } from '@shared/hooks/CampaignProvider'
import { ImpersonateUserProvider } from '@shared/user/ImpersonateUserProvider'
import { headers } from 'next/headers'
import PromoBanner from '@shared/utils/PromoBanner'

const getReqPathname = () => {
  const headersList = headers()
  return headersList.get('x-pathname')
}

const isProductRoute = (pathname) => {
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

const PageWrapper = ({ children }) => {
  const pathname = getReqPathname()
  const isProductPath = isProductRoute(pathname)
  const isLoginPath = pathname === '/login'
  const isSignUpPath = pathname === '/sign-up'
  const showPromoAlert = !(isProductPath || isLoginPath || isSignUpPath)

  return (
    <UserProvider>
      <ImpersonateUserProvider>
        <CampaignProvider>
          <CampaignStatusProvider>
            <NavigationProvider>
              <div className="overflow-x-hidden">
                <JsonLdSchema />
                <Nav />
                {showPromoAlert && (
                  <Suspense>
                    <PromoBanner />
                  </Suspense>
                )}
                {children}
                {!isProductPath && (
                  <Suspense>
                    <Footer />
                  </Suspense>
                )}
                <Snackbar />
                <Suspense>
                  <CookiesSnackbar />
                </Suspense>
              </div>
            </NavigationProvider>
          </CampaignStatusProvider>
        </CampaignProvider>
      </ImpersonateUserProvider>
    </UserProvider>
  )
}

export default PageWrapper
