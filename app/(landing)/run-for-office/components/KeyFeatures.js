import MaxWidth from '@shared/layouts/MaxWidth';
import Image from 'next/image';
import contentImg from 'public/images/run-for-office/my-content.png';
import trackerImg from 'public/images/run-for-office/campaign-tracker.png';
import expertsImg from 'public/images/run-for-office/experts.png';
import mapImg from 'public/images/run-for-office/map.png';
import GetStartedCTA from './GetStartedCTA';

export default function KeyFeatures() {
  return (
    <section className="relative py-12 lg:py-20">
      <MaxWidth>
        <div className="relative z-10">
          <h2 className="text-3xl lg:text-6xl font-semibold ">
            Key features -free!
          </h2>
          <div className="grid grid-cols-12 gap-4 mt-10">
            <div className="col-span-12 lg:col-span-5">
              <div className="bg-white rounded-2xl px-5 pt-5 lg:px-14 lg:pt-14 h-full shadow-lg  flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-semibold">
                    1. Create winning content in seconds
                  </h3>
                  <div className="text-lg my-8">
                    Save time and multiply your campaign&apos;s output with AI
                    trained on dozens of carefully honed templates from press
                    releases to endorsement pitches.
                  </div>
                  <GetStartedCTA id="tools-winning-content" />
                </div>
                <Image src={contentImg} alt="content" className="mt-10" />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-7">
              <div className="bg-white rounded-2xl p-5 lg:p-14  h-full shadow-lg">
                <Image src={trackerImg} alt="content" className="mb-10" />
                <h3 className="text-2xl lg:text-3xl font-semibold">
                  2. Run a data-driven campaign
                </h3>
                <div className="text-lg mb-4">
                  Unlock{' '}
                  <Image
                    src="/images/heart-hologram.svg"
                    width={30}
                    height={24}
                    alt="gp"
                    className="inline-block mx-1"
                  />{' '}
                  AI Data Analyst to transform voter data into a winning
                  canvassing plan and turnout strategy.
                </div>
                <GetStartedCTA id="tools-data-campaign" />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-white rounded-2xl p-5 lg:p-14  h-full shadow-lg">
                <Image src={expertsImg} alt="content" className="mb-10" />
                <h3 className="text-2xl lg:text-3xl font-semibold">
                  3. Access to real campaign experts
                </h3>
                <div className="text-lg mb-4">
                  Get 1:1 support and advice from our campaign experts, whether
                  you&apos;re running for town council or congress.
                </div>
                <GetStartedCTA id="tools-access-experts" />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="flex flex-col justify-between h-full">
                <div className="bg-white rounded-2xl p-5 lg:p-14  h-full shadow-lg">
                  <div className="flex justify-center">
                    <Image src={mapImg} alt="content" className="mb-10" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-semibold">
                    4. Devoted volunteer network
                  </h3>
                  <div className="text-lg mb-4">
                    Tap into our movement of 1,000+ remote volunteers eager to
                    help power your path to victory.
                  </div>
                  <GetStartedCTA id="tools-volunteer-network" />
                </div>
                <div className="bg-white rounded-2xl p-5 lg:p-14  h-full shadow-lg mt-4">
                  <h3 className="text-2xl lg:text-3xl font-semibold">
                    5. Dedicated resource library
                  </h3>
                  <div className="text-lg mb-4">
                    A carefully curated library of the most proven resources to
                    help you become a viable candidate.
                  </div>
                  <GetStartedCTA id="tools-resource-library" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </MaxWidth>
      <div className="absolute w-full left-0 h-full top-0">
        <Image
          src="/images/landing-pages/spot-bg.svg"
          fill
          alt="bg"
          className="object-cover  object-left-top"
        />
      </div>
    </section>
  );
}
