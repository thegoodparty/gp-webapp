import Link from 'next/link';
import Image from 'next/image';
import LeftSide from './LeftSide';
import RightSide from './RightSide';
import RightSideMobile from './RightSideMobile';
import { Suspense } from 'react';

export default function Nav() {
  return (
    <>
      <div className="fixed w-screen h-14 z-50">
        <div className="relative bg-slate-50 lg:block border-solid border-b border-zinc-200 px-5 lg:px-8 z-50 h-14">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center">
              <Link href="/" id="nav-logo">
                <Image
                  src="/images/heart-hologram.svg"
                  data-cy="logo"
                  width={30}
                  height={24}
                  alt="GOOD PARTY"
                  priority
                />
              </Link>
              <Suspense>
                <LeftSide />
              </Suspense>
            </div>
            <Suspense>
              <RightSide />
            </Suspense>
          </div>
        </div>
      </div>
      <Suspense>
        <RightSideMobile />
      </Suspense>
      <div className="h-14 relative">&nbsp;</div>
    </>
  );
}
