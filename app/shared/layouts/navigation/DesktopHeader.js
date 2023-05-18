import Link from 'next/link';
import Image from 'next/image';

import MaxWidth from '../MaxWidth';
import LearnMore from './LearnMore';
import OfficeLink from './OfficeLink';
import RegisterOrProfile from './RegisterOrProfile';

export default function DesktopHeader() {
  return (
    <div className="relative bg-slate-50 hidden lg:block border-solid border-b border-zinc-200 px-6 z-50 h-14">
      <MaxWidth>
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            <Link href="/" id="desktop-nav-logo">
              <Image
                src="/images/logo-hologram.svg"
                data-cy="logo"
                width={145}
                height={32}
                alt="GOOD PARTY"
              />
            </Link>
            <div className="pl-4 text-sm">Helping real people run and win!</div>
          </div>
          <div className="flex justify-end items-center">
            <LearnMore />
            <OfficeLink />
            <RegisterOrProfile />
          </div>
        </div>
      </MaxWidth>
    </div>
  );
}
