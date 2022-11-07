import { createServerContext } from 'react';
import Footer from './Footer';
import Nav from './navigation/Nav';
import { getUserCookie } from '/helpers/cookieHelper';

export const AppContext = createServerContext();

export default function PageWrapper({ children, hideFooter }) {
  const user = getUserCookie(true);
  const APP_BASE = process.env.APP_BASE;
  const childProps = {
    user,
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
