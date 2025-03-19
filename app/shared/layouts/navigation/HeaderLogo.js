'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCampaign } from '@shared/hooks/useCampaign';
import { useCampaignStatus } from '@shared/hooks/useCampaignStatus';
import { EVENTS, trackEvent } from 'helpers/fullStoryHelper';
import { usePathname } from 'next/navigation';

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
  const [campaignStatus] = useCampaignStatus();
  const pathname = usePathname();

  const { isPro } = campaign || {};
  const { status } = campaignStatus || {};
  const link = status && campaign ? '/dashboard' : '/';
  return (
    <>
      <Link
        className="flex items-center no-underline"
        href={link}
        id="nav-logo"
        onClick={() =>
          trackEvent(EVENTS.Navigation.Top.ClickLogo, { pathname })
        }
      >
        <Image
          src="/images/logo/heart.svg"
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
