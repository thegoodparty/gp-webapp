import MaxWidth from '@shared/layouts/MaxWidth';
import Connect from './Connect';
import Hero from './Hero';
import Points from './Points';
import WhatIs from './WhatIs';

export default function RunForOfficePage() {
  return (
    <div className="mb-40">
      <Hero />
      <MaxWidth>
        <WhatIs />
        <Points />
        <Connect />
      </MaxWidth>
    </div>
  );
}
