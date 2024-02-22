import GreatSuccess from './GreatSuccess';
import Hero from './Hero';
import KeyFeatures from './KeyFeatures';
import Pricing from './Pricing';
import ProTools from './ProTools';
import StartedBottom from './StartedBottom';
import WhatIsCampaign from './WhatIsCampaign';

export default function RunForOfficePage({ articles }) {
  return (
    <div className="bg-slate-50">
      <Hero />
      <div className="bg-[linear-gradient(172deg,_#EEF3F7_54.5%,_#13161A_55%)] h-[calc(100vw*.17)] w-full" />
      <WhatIsCampaign />
      <KeyFeatures />
      <ProTools />
      <Pricing />
      <GreatSuccess />
      <div className="bg-[linear-gradient(172deg,_#EEF3F7_54.5%,_#D8ED50_55%)] h-[calc(100vw*.17)] w-full" />
      <StartedBottom />
    </div>
  );
}
