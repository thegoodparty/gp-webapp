import { Suspense } from 'react';
import MaxWidth from '@shared/layouts/MaxWidth';
import CandidatesSection from './CandidatesSection';
import Hero from './Hero';
import WhatsNext from './WhatsNext';

export default function HomePage() {
  return (
    <>
      <MaxWidth>
        <Hero />
        <Suspense fallback={<p>Loading...</p>}>
          <CandidatesSection />
        </Suspense>
      </MaxWidth>
      <Suspense fallback={<p>Loading...</p>}>
        <WhatsNext />
      </Suspense>
    </>
  );
}
