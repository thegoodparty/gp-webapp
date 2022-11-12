import React, { Suspense } from 'react';
import MaxWidth from '../../shared/layouts/MaxWidth';
import Hero from './components/Hero';
import Team from './components/Team';

export default function Page() {
  return (
    <MaxWidth>
      <Hero />
      <Suspense>
        <Team />
      </Suspense>
    </MaxWidth>
  );
}
