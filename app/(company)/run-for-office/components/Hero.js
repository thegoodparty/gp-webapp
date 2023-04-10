'use client';
import Pill from '@shared/buttons/Pill';
import MaxWidth from '@shared/layouts/MaxWidth';
import Chat from './Chat';
import RunCampaignButton from './RunCampaignButton';

export default function Hero({ demoCallback }) {
  return (
    <MaxWidth>
      <div className="grid grid-cols-12 lg:gap-10 py-16">
        <div className="col-span-12 lg:col-span-6">
          <h1 className="font-black text-6xl">
            Free tools and expertise to run winning campaigns
          </h1>
          <h2 className="mt-3 mb-12 text-xl">
            Free tools, training, and expert knowledge to help independent and
            third-party candidates run winning campaigns.
          </h2>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-6">
              <RunCampaignButton fullWidth id="hero-get-started-btn" />
            </div>
            <div className="col-span-12 lg:hidden text-center text-lg font-black">
              OR
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div onClick={demoCallback} id="hero-demo-btn">
                <Pill outlined className="w-full">
                  <div className="tracking-wide">GET A DEMO</div>
                </Pill>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 text-center">
          <Chat />
        </div>
      </div>
    </MaxWidth>
  );
}
