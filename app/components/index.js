import { Suspense } from 'react';
import MaxWidth from '@shared/layouts/MaxWidth';
import CandidatesSection from './CandidatesSection';
import Hero from './Hero';
import WhatsNext from './WhatsNext';
import TempClient from './tempClient';

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
      <div>Env{JSON.stringify(process.env)}</div>
      <br />
      <br />
      <TempClient />
    </>
  );
}
