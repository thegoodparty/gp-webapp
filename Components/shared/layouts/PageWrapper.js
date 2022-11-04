import { createServerContext } from 'react';
import Footer from './Footer';
import Nav from './navigation/Nav';
import { getUserCookie } from '/helpers/cookieHelper';

export const AppContext = createServerContext();

export default function PageWrapper({ children, hideFooter }) {
  const user = getUserCookie(true);
  const childProps = {
    user,
  };
  return (
    <AppContext.Provider value={childProps}>
      <div>
        <Nav />
        {children}
        {!hideFooter && <Footer />}
      </div>
    </AppContext.Provider>
  );
}
