import MaxWidth from '@shared/layouts/MaxWidth';
import Hero from './Hero';
import WhatIs from './WhatIs';

export default function HomePage() {
  return (
    <div className="mb-40">
      <Hero />
      <MaxWidth>
        <WhatIs />
      </MaxWidth>
    </div>
  );
}
