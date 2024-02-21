import Hero from './Hero';
import KeyFeatures from './KeyFeatures';
import ProTools from './ProTools';
import WhatIsCampaign from './WhatIsCampaign';

export default function RunForOfficePage({ articles }) {
  return (
    <div className="bg-slate-50">
      <Hero />
      <div className="bg-[linear-gradient(172deg,_#EEF3F7_54.5%,_#13161A_55%)] h-[calc(100vw*.17)] w-full" />
      <WhatIsCampaign />
      <KeyFeatures />
      <ProTools />
    </div>
  );
}
