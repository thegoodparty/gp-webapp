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

import PromoBanner from '@shared/utils/PromoBanner'
import { getReqPathname } from '@shared/utils/getReqPathname'
import { fetchUserCampaign } from 'app/onboarding/shared/getCampaign'
import SegmentIdentify from './navigation/SegmentIdentify'
import { P2pUxEnabledProvider } from 'app/dashboard/components/tasks/flows/hooks/P2pUxEnabledProvider'
import { SentryIdentifier } from '@shared/sentry'
import AmplitudeInit from '@shared/AmplitudeInit'
import { OrganizationProvider } from '@shared/organization-picker'
import { serverRequest } from 'gpApi/server-request'
import { ClerkProvider } from '@clerk/nextjs'
import { ReactQueryProvider } from '@shared/query-client'
import { FeatureFlagsProvider } from '@shared/experiments/FeatureFlagsProvider'
import ImpersonationBanner from '@shared/user/ImpersonationBanner'

interface PageWrapperProps {
  children: React.ReactNode
}

const PageWrapper = async ({
  children,
}: PageWrapperProps): Promise<React.JSX.Element> => {
  const token = await getServerToken()
  const isAuthed = token && !isTokenExpired(token)

  const [pathname, campaign, organizations] = await Promise.all([
    getReqPathname(),
    isAuthed ? fetchUserCampaign() : Promise.resolve(null),
    isAuthed
      ? serverRequest(
          'GET /v1/organizations',
          {},
          { ignoreResponseError: true },
        ).then((res) => (res.ok ? res.data.organizations : []))
      : Promise.resolve([]),
  ])

  return (
    <ClerkProvider>
      <ImpersonationBanner />
      <ReactQueryProvider>
        <FeatureFlagsProvider>
          <UserProvider>
            <AmplitudeInit />
            <OrganizationProvider initialOrganizations={organizations}>
              <CampaignProvider campaign={campaign}>
                <SentryIdentifier />
                <ElectedOfficeProvider>
                  <CampaignStatusProvider>
                    <P2pUxEnabledProvider>
                      <NavigationProvider>
                        <SnackbarProvider>
                          <div className="overflow-x-hidden">
                            <JsonLdSchema />
                            <Nav />
                            <Suspense>
                              <PromoBanner initPathname={pathname || ''} />
                            </Suspense>
                            {children}
                            <Suspense>
                              <Footer initPathname={pathname || ''} />
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
            </OrganizationProvider>
          </UserProvider>
        </FeatureFlagsProvider>
      </ReactQueryProvider>
    </ClerkProvider>
  )
}

export default PageWrapper
