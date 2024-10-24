import Snackbar from '@shared/utils/Snackbar';
import { Suspense } from 'react';
import Footer from 'app/shared/layouts/footer/Footer';
import JsonLdSchema from './JsonLdSchema';
import Nav from './navigation/Nav';
import CookiesSnackbar from './CookiesSnackbar';
import { NavigationProvider } from '@shared/layouts/navigation/NavigationProvider';
import { UserProvider } from '@shared/user/UserProvider';
import { CampaignStatusProvider } from '@shared/user/CampaignStatusProvider';
import { CampaignProvider } from '@shared/user/CampaignProvider';
import { InsecureCookieClearer } from '@shared/layouts/InsecureCookieClearer';
import { ImpersonateUserProvider } from '@shared/user/ImpersonateUserProvider';

export default function PageWrapper({ children, hideFooter }) {
  return (
    <InsecureCookieClearer>
      <UserProvider>
        <ImpersonateUserProvider>
          <CampaignProvider>
            <CampaignStatusProvider>
              <NavigationProvider>
                <div className="overflow-x-hidden">
                  <JsonLdSchema />
                  <Nav />
                  {children}
                  {!hideFooter && (
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
    </InsecureCookieClearer>
  );
}
