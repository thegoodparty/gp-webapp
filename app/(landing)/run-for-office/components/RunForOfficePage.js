import GreatSuccess from './GreatSuccess';
import Hero from './Hero';
import KeyFeatures from './KeyFeatures';
import Pricing from './Pricing';
import ProTools from './ProTools';
import StartedBottom from './StartedBottom';
import WhatIsCampaign from './WhatIsCampaign';

export default function RunForOfficePage({ articles }) {
  return (
    <div className="bg-indigo-200">
      <Hero />
      <div className="bg-[linear-gradient(172deg,_#F9FAFB_54.5%,_#0D1528_55%)] h-[calc(100vw*.17)] w-full" />
      <WhatIsCampaign />
      <KeyFeatures />
      <ProTools />
      <Pricing />
      <GreatSuccess />
      <StartedBottom />
    </div>
  );
}
