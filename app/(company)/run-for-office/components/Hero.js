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
        <div className="flex flex-row w-full mt-5 justify-between">
          <Image
            src="/images/run-page/squiggles.svg"
            width="90"
            height="90"
            className="ml-10"
          />

          <Image
            src="/images/run-page/hero-star.svg"
            width="90"
            height="90"
            className="mr-5"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 md:gap-10">
        <div className="col-span-12 md:col-span-6">
          <h1 className="font-black text-6xl -mt-10">
            Free tools to help real people run and win
          </h1>
          <h2 className="mt-3 mb-12 text-xl">
            Our free AI Campaign Manager and team with 50+ years of experience
            power independent campaigns. We're here to make running as an
            indepdendent possible!
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
        <div className="col-span-12 md:col-span-6 text-center">
          <HeroImages />
        </div>
      </div>
    </MaxWidth>
  );
}
