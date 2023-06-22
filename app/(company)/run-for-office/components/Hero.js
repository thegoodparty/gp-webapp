'use client';
import MaxWidth from '@shared/layouts/MaxWidth';
import RunCampaignButton from './RunCampaignButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import HeroImages from './HeroImages';
import Image from 'next/image';

export default function Hero({ demoCallback }) {
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
          />

          <Image
            src="/images/run-for-office/hero-star.svg"
            width="120"
            height="120"
            className="mt-5"
            alt=""
          />
        </div>
      </div>

      <div className="grid grid-cols-12 md:gap-10 pl-8 pr-8">
        <div className="col-span-12 md:col-span-7">
          <h1 className="font-semibold text-[42px] md:text-[60px] lg:text-[92px] leading-[42px] lg:leading-[92px] -mt-10">
            Free tools to help real people run and win
          </h1>
          <h2 className="mt-3 mb-12 font-sfpro text-black font-normal text-[18px] leading-[24px]">
            Our free AI Campaign Manager and team with 50+ years of experience
            power independent campaigns. We&apos;re here to make running as an
            independent possible!
          </h2>
          <div className="grid grid-cols-12 gap-6">
            <div className="flex flex-row w-full col-span-12">
              <div className="mr-4">
                <RunCampaignButton id="hero-get-started-btn" />
              </div>
              <div onClick={demoCallback} id="hero-demo-btn">
                <SecondaryButton outlined className="w-full">
                  <div className="tracking-wide">Get a Demo</div>
                </SecondaryButton>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-5 text-center">
          <HeroImages />
        </div>
      </div>
    </MaxWidth>
  );
}
