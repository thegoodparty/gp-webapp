import { Suspense } from 'react';
import MaxWidth from '@shared/layouts/MaxWidth';
import Hero from './components/Hero';
import Plans from './components/Plans';

export default function Page() {
  return (
    <MaxWidth>
      <Hero />
      <Suspense>
        <Plans />
      </Suspense>
    </MaxWidth>
  );
}
