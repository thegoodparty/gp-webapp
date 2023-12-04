import MaxWidth from '@shared/layouts/MaxWidth';
import Hero from './Hero';
import Dissatisfaction from './Dissatisfaction';
import WhatWillDo from './WhatWillDo';
import Community from './Community';
import Benefits from './Benefits';
import { Suspense } from 'react';

export default function RunForOfficePage() {
  return (
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
    </div>
  );
}
