import Button from '@shared/buttons/Button';
import MaxWidth from '@shared/layouts/MaxWidth';
import Body1 from '@shared/typography/Body1';
import MarketingH2 from '@shared/typography/MarketingH2';
import Image from 'next/image';
import { memo } from 'react';

export default memo(function CommunitySection() {
  return (
    <div className="bg-slate-100 py-8 lg:py-24">
      <MaxWidth>
        <div className="grid grid-cols-12 gap-4  grid-flow-col-reverse ">
          <div className="col-span-12 lg:col-span-6 order-2 lg:order-1 flex flex-col justify-between">
            <div>
              <MarketingH2>Build community power in your hometown</MarketingH2>
              <Body1 className="mt-8">
                GoodParty.org connects voters ready for change with
                people-powered candidates fighting for the issues that matter
                most to their communities. Explore volunteer opportunities to
                support candidates running near you or get support for your own
                run for office.
              </Body1>
            </div>
            <div className="lg:flex mt-12 lg:mt-0">
              <Button
                href="/volunteer"
                size="large"
                className="mr-5 block w-full lg:w-auto"
              >
                Join the community
              </Button>

              <Button
                href="/run-for-office"
                size="large"
                variant="outlined"
                className="block mt-4 lg:mt-0 w-full lg:w-auto"
              >
                Campaign Tools
              </Button>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 order-1 lg:order-2">
            <Image
              src="https://assets.goodparty.org/map-search/community.png"
              width={593}
              height={464}
              alt="Community Section"
            />
          </div>
        </div>
      </MaxWidth>
    </div>
  );
});
