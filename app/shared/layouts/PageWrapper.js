import { Suspense } from 'react';
import Footer from './Footer';
import JsonLdSchema from './JsonLdSchema';
import Nav from './navigation/Nav';

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
    </div>
  );
}
