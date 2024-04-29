import Snackbar from '@shared/utils/Snackbar';
import { Suspense } from 'react';
import Footer from 'app/shared/layouts/footer/Footer';
import JsonLdSchema from './JsonLdSchema';
import Nav from './navigation/Nav';
import { Cookie } from 'next/font/google';
import CookiesSnackbar from './CookiesSnackbar';

export default function PageWrapper({ children, hideFooter }) {
  return (
    <div className="overflow-x-hidden">
      <JsonLdSchema />
      <Nav />
      {children}
      {!hideFooter && (
        <Suspense>
          <Footer />
        </Suspense>
      )}
      {/* <Suspense> */}
      <Snackbar />
      <Suspense>
        <CookiesSnackbar />
      </Suspense>
      {/* </Suspense> */}
    </div>
  );
}
