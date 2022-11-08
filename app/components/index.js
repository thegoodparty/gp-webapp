import { createServerContext } from 'react';
import MaxWidth from '../shared/layouts/MaxWidth';
import CandidatesSection from './CandidatesSection';
import Hero from './Hero';

export default function HomePage() {
  return (
    <>
      <MaxWidth>
        <Hero />
        <CandidatesSection />
      </MaxWidth>
    </>
  );
}
