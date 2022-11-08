import { createServerContext } from 'react';
import Footer from './Footer';
import Nav from './navigation/Nav';
import { cookies } from 'next/headers';

export const AppContext = createServerContext();

export default function PageWrapper({ children, hideFooter }) {
  const nextCookies = cookies();
  const user = nextCookies.get('user')?.value;
  const APP_BASE = process.env.APP_BASE;
  const childProps = {
    user: user ? JSON.parse(user) : false,
    APP_BASE,
  };
  return (
    <AppContext.Provider value={childProps}>
      <div className="overflow-x-hidden">
        <Nav />
        {children}
        {!hideFooter && <Footer />}
      </div>
    </AppContext.Provider>
  );
}
