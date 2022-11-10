import { createServerContext, Suspense } from 'react';
import Footer from './Footer';
import Nav from './navigation/Nav';

export const AppContext = createServerContext();

export default function PageWrapper({ children, hideFooter }) {
  return (
    <div className="overflow-x-hidden">
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
