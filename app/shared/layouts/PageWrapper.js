import { SnackbarProvider } from '@shared/utils/Snackbar'
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
import PromoBanner from '@shared/utils/PromoBanner'
import { getReqPathname } from '@shared/utils/getReqPathname'

const PageWrapper = async ({ children }) => {
  const pathname = await getReqPathname()
  return (
    <UserProvider>
      <ImpersonateUserProvider>
        <CampaignProvider>
          <CampaignStatusProvider>
            <NavigationProvider>
              <SnackbarProvider>
                <div className="overflow-x-hidden">
                  <JsonLdSchema />
                  <Nav />
                  <Suspense>
                    <PromoBanner initPathname={pathname} />
                  </Suspense>
                  {children}
                  <Suspense>
                    <Footer initPathname={pathname} />
                  </Suspense>
                  <Suspense>
                    <CookiesSnackbar />
                  </Suspense>
                </div>
              </SnackbarProvider>
            </NavigationProvider>
          </CampaignStatusProvider>
        </CampaignProvider>
      </ImpersonateUserProvider>
    </UserProvider>
  )
}

export default PageWrapper
