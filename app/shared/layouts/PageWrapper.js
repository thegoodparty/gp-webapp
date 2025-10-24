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
import { ElectedOfficeProvider } from '@shared/hooks/ElectedOfficeProvider'
import { ImpersonateUserProvider } from '@shared/user/ImpersonateUserProvider'
import PromoBanner from '@shared/utils/PromoBanner'
import { getReqPathname } from '@shared/utils/getReqPathname'
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign'
import SegmentIdentify from './navigation/SegmentIdentify'
import { P2pUxEnabledProvider } from 'app/(candidate)/dashboard/components/tasks/flows/hooks/P2pUxEnabledProvider'

const PageWrapper = async ({ children }) => {
  const pathname = await getReqPathname()
  const campaign = await fetchUserCampaign()

  return (
    <UserProvider>
      <ImpersonateUserProvider>
        <CampaignProvider initCampaign={campaign}>
          <ElectedOfficeProvider>
            <CampaignStatusProvider>
            <P2pUxEnabledProvider>
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
                    <Suspense>
                      <SegmentIdentify />
                    </Suspense>
                  </div>
                </SnackbarProvider>
              </NavigationProvider>
            </P2pUxEnabledProvider>
            </CampaignStatusProvider>
          </ElectedOfficeProvider>
        </CampaignProvider>
      </ImpersonateUserProvider>
    </UserProvider>
  )
}

export default PageWrapper
