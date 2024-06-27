'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCampaign } from '@shared/hooks/useCampaign';

const ProBadge = () => (
  <div
    className="
      pro-label
      font-semibold
      border
      border-gray-900
      rounded
      ml-2
      h-fit
      text-[10px]
      tracking-widest
      p-1
    "
  >
    PRO
  </div>
);

export const HeaderLogo = () => {
  const [campaign] = useCampaign();
  const { isPro } = campaign || {};
  return (
    <>
      <Link className="flex items-center no-underline" href="/" id="nav-logo">
        <Image
          src="/images/heart-hologram.svg"
          data-cy="logo"
          width={30}
          height={24}
          alt="GoodParty.org"
          priority
        />
        {isPro && <ProBadge />}
      </Link>
    </>
  );
};
