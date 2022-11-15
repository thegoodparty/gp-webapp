import { Suspense } from 'react';
import MaxWidth from '@shared/layouts/MaxWidth';
import Hero from './components/Hero';
import Plans from './components/Plans';
import JsonLdSchema from '@shared/layouts/JsonLdSchema';

export default function Page() {
  return (
    <MaxWidth>
      <JsonLdSchema />
      <Hero />
      <Suspense>
        <Plans />
      </Suspense>
    </MaxWidth>
  );
}
