import Hero from './Hero';
import Dissatisfaction from './Dissatisfaction';
import WhatWillDo from './WhatWillDo';
import Community from './Community';
import Benefits from './Benefits';
import { Suspense } from 'react';
import FromCommunity from './FromCommunity';
import FAQs from './FAQs';
import HelpWin from './HelpWin';
import StickersCallout from '@shared/utils/StickersCallout';

export default function RunForOfficePage() {
  return (
    <>
      <StickersCallout />
      <div className="mt-16 md:mt-32">
        <Hero />
        <Suspense>
          <Dissatisfaction />
        </Suspense>
        <Suspense>
          <WhatWillDo />
        </Suspense>
        <Suspense>
          <Community />
        </Suspense>
        <Suspense>
          <Benefits />
        </Suspense>

        <Suspense>
          <FromCommunity />
        </Suspense>
        <Suspense>
          <FAQs />
        </Suspense>
        <Suspense>
          <HelpWin />
        </Suspense>
      </div>
    </>
  );
}
