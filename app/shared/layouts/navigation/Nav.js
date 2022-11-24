import UserState from '@shared/store/UserState';
import { Suspense } from 'react';
import DesktopHeader from './DesktopHeader';
import MobileMenu from './MobileMenu';

export default function Nav() {
  return (
    <>
      <UserState />
      <div className="md:hidden fixed bottom-7 right-7 w-16 h-16 z-40 rounded-full flex items-center shadow-md bg-white justify-center">
        <Suspense>
          <MobileMenu />
        </Suspense>
      </div>
      <DesktopHeader />
    </>
  );
}
