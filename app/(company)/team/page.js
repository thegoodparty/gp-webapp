import React, { Suspense } from 'react';
import MaxWidth from '../../shared/layouts/MaxWidth';
import Hero from './components/Hero';
import Team from './components/Team';
import Volunteers from './components/Volunteers';

export default function Page() {
  return (
    <MaxWidth>
      <Hero />
      <Suspense>
        <Team />
      </Suspense>
      <Suspense>
        <Volunteers />
      </Suspense>
    </MaxWidth>
  );
}
