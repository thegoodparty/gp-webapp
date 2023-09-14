import Link from 'next/link';
import Image from 'next/image';

import RightSide from './RightSide';
import PrimaryButton from '@shared/buttons/PrimaryButton';

export default function Nav() {
  return (
    <>
      <div className="fixed w-screen h-14 z-50">
        <div className="relative bg-slate-50 lg:block border-solid border-b border-zinc-200 px-5 lg:px-8 z-50 h-14">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center">
              <Link href="/" id="nav-logo">
                <div className="xs:hidden">
                  <Image
                    src="/images/heart-hologram.svg"
                    data-cy="logo"
                    width={40}
                    height={32}
                    alt="GOOD PARTY"
                    priority
                  />
                </div>
                <div className="hidden xs:block">
                  <Image
                    src="/images/logo-hologram.svg"
                    data-cy="logo"
                    width={145}
                    height={32}
                    alt="GOOD PARTY"
                    priority
                  />
                </div>
              </Link>
              <div className="pl-4 text-sm hidden lg:block">
                Helping real people run and win!
              </div>
            </div>
            <div className="flex justify-end items-center">
              <RightSide />
            </div>
          </div>
        </div>
      </div>
      <div className="h-14 relative">&nbsp;</div>
      <div className="flex w-screen h-14">
        <div className="flex w-full bg-lime-400 lg:block border-solid border-b border-zinc-200 px-5 lg:px-8 h-14">
          <div className="flex w-full justify-center items-center h-14">
            Join our Discord community - meet like-minded independents and get
            involved!
            <Link
              id="nav-join-discord"
              href="https://discord.gg/goodparty"
              target="_blank"
              aria-label="Join our Discord community - meet like-minded independents and get involved!"
            >
              <div className="whitespace-nowrap ml-5">
                <PrimaryButton size="medium">Join Now</PrimaryButton>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
