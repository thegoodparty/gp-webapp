import WhatWeDo from './WhatWeDo';
import Features from './Features';
import Hero from './Hero';
import Cta from './Cta';
import Blog from './Blog';

export default function RunForOfficePage({ articles }) {
  return (
    <div className="bg-slate-50">
      <Hero />
      <div className="bg-[linear-gradient(-172deg,_#EEF3F7_54.5%,_#13161A_55%)] h-[calc(100vw*.17)] w-full" />
      <WhatWeDo />
      <div className="bg-[linear-gradient(-172deg,_#13161A_54.5%,_#EEF3F7_55%)] h-[calc(100vw*.17)] w-full" />
      <Features />
      <Blog articles={articles} />
      <Cta />
    </div>
  );
}
