'use client';
import MaxWidth from '@shared/layouts/MaxWidth';
import RunCampaignButton from './RunCampaignButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import Image from 'next/image';
import Link from 'next/link';
import H3 from '@shared/typography/H3';
import WhiteButton from './WhiteButton';
import heroImg from 'public/images/run-for-office/run-hero.png';

export default function Hero() {
  return (
    <MaxWidth>
      <section className="py-12 lg:py-14">
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-12 lg:col-span-6">
            <h1 className="font-semibold text-6xl md:text-7xl mb-7">
              Free tools and tactics for your campaign
            </h1>
            <H3>
              Good Party helps people-powered candidates run viable campaigns
              with free tech, data, and insights.
            </H3>
            <div className="mt-10 flex">
              <RunCampaignButton id="hero-get-started" />
              <Link href="/get-a-demo" id="hero-demo" className="block ml-5">
                <WhiteButton label="Book a free demo" />
              </Link>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 mt-10 lg:mt-0">
            <Image src={heroImg} alt="run for office" />
          </div>
        </div>
      </section>
    </MaxWidth>
  );
}
