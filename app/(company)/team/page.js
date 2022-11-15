import React, { Suspense } from 'react';
import MaxWidth from '@shared/layouts/MaxWidth';
import Hero from './components/Hero';
import Team from './components/Team';
import Volunteers from './components/Volunteers';
import JsonLdSchema from '@shared/layouts/JsonLdSchema';

export default function Page() {
  return (
    <MaxWidth>
      <JsonLdSchema />
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
