/**
 *
 * CareersWrapper
 *
 */

import React, { Suspense } from 'react';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import Hero from './components/Hero';
import Values from './components/Values';
// import LeverCareers from './components/LeverCareers';
import AshbyCareers from './components/AshbyCareers';
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

export const fetchJobs = async () => {
  const api = gpApi.jobs.list;
  return await gpFetch(api, false, 3600);
};

async function CareersWrapper() {
  const { jobs } = await fetchJobs();

  const childProps = {
    jobs,
  };

  return (
    <>
      <MaxWidth>
        <Hero />
      </MaxWidth>
      <MaxWidth>
        {/* <LeverCareers /> */}
        <AshbyCareers {...childProps} />
        <Suspense fallback={`Loading...`}>
          <Values />
        </Suspense>

        <Suspense fallback={`Loading...`}>
          <Why />
        </Suspense>
      </MaxWidth>
    </>
  );
}

export default CareersWrapper;
