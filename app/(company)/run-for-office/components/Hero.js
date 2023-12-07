'use client';
import MaxWidth from '@shared/layouts/MaxWidth';
import RunCampaignButton from './RunCampaignButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import HeroImages from './HeroImages';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <MaxWidth>
      <div className="flex flex-row w-full">
        <div className="flex flex-row w-full mt-5 justify-between h-auto">
          <Image
            src="/images/run-for-office/squiggles.svg"
            width="90"
            height="90"
            className="ml-12"
            alt=""
            priority
          />

          <Image
            src="/images/run-for-office/hero-star.svg"
            width="120"
            height="120"
            className="mt-5"
            alt="star"
            priority
          />
        </div>
      </div>

      <div className="grid grid-cols-12 md:gap-10 md:pl-8 md:pr-8">
        <div className="col-span-12 md:col-span-7">
          <h1 className="font-semibold text-[38px] leading-[38px] xs:text-[48px] xs:leading-[48px] md:text-[52px] md:leading-[52px] lg:text-[72px] lg:leading-[72px] xl:text-[92px] xl:leading-[92px] -mt-10">
            Free tools to
            <br />
            help real people
            <br />
            run and win
          </h1>
          <h2 className="mt-3 mb-12 font-sfpro text-black font-normal text-[18px] leading-[24px]">
            Our free AI Campaign Manager and team with 50+ years of experience
            power independent campaigns. We&apos;re here to make running as an
            independent possible!
          </h2>
          <div className="mr-4 inline-block mb-2 xs:mb-0">
            <RunCampaignButton id="hero-get-started-btn" />
          </div>
          <div className="xs:hidden"></div>
          <Link href="/get-a-demo" className="inline-block" id="hero-demo-btn">
            <SecondaryButton outlined className="w-full">
              <div className="tracking-wide">Get a Demo</div>
            </SecondaryButton>
          </Link>
        </div>
        <div className="col-span-12 md:col-span-5 text-center">
          <HeroImages />
        </div>
      </div>
    </MaxWidth>
  );
}
