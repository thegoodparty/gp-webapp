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
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Work with us | GOOD PARTY',
  description:
    'Good Party is building amazing, open-source social tools that empower the creative community to mobilize digital natives and have millions of people vote differently.',
  slug: '/work-with-us',
});
export const metadata = meta;

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
