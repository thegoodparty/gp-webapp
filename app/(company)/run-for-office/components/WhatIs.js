import PurpleButton from '@shared/buttons/PurpleButton';
import Link from 'next/link';
import RunCampaignButton from './RunCampaignButton';

export default function WhatIs() {
  return (
    <div className="border-t border-b border-neutral-300 py-8 grid grid-cols-12 gap-3 items-center">
      <div className="col-span-12 lg:col-span-10">
        <h3 className="text-lg font-light">WHAT IS GOOD PARTY</h3>
        <div className="font-black text-2xl lg:pr-36">
          We help first-time and incumbent independent candidates run better
          campaigns. Get access to free tools and expert knowledge to reach the
          voters, volunteers, and donors you need without the party politics.
        </div>
      </div>
      <div className="col-span-12 mt-6 lg:mt-0 lg:col-span-2">
        <RunCampaignButton />
      </div>
    </div>
  );
}
