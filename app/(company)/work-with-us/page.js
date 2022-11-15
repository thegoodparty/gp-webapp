/**
 *
 * CareersWrapper
 *
 */

import React, { Suspense } from 'react';

import Hero from './components/Hero';
import Values from './components/Values';
import LeverCareers from './components/LeverCareers';
import Why from './components/Why';
import MaxWidth from '@shared/layouts/MaxWidth';

function CareersWrapper() {
  return (
    <>
      <MaxWidth>
        <Hero />
      </MaxWidth>
      <Suspense fallback={`Loading...`}>
        <Values />
      </Suspense>
      <MaxWidth>
        <Suspense fallback={`Loading...`}>
          <LeverCareers />
        </Suspense>
        <Suspense fallback={`Loading...`}>
          <Why />
        </Suspense>
      </MaxWidth>
    </>
  );
}

export default CareersWrapper;
