import { createServerContext, Suspense } from 'react';
import Footer from './Footer';
import Nav from './navigation/Nav';

export const AppContext = createServerContext();

export default function PageWrapper({ children, hideFooter }) {
  const APP_BASE = process.env.APP_BASE;
  const childProps = {
    APP_BASE,
  };
  return (
    <AppContext.Provider value={childProps}>
      <div className="overflow-x-hidden">
        <Nav />
        {children}
        {!hideFooter && (
          <Suspense>
            <Footer />
          </Suspense>
        )}
      </div>
    </AppContext.Provider>
  );
}
