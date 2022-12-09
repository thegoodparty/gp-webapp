import { Suspense } from 'react';
import DesktopHeader from './DesktopHeader';
import MobileMenu from './MobileMenu';

export default function Nav() {
  return (
    <>
      <div className="lg:hidden fixed bottom-7 right-7 w-16 h-16 z-40 rounded-full flex items-center shadow-md bg-white justify-center">
        <Suspense>
          <MobileMenu />
        </Suspense>
      </div>
      <DesktopHeader />
    </>
  );
}
