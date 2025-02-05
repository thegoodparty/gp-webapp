/**
 *
 * CareersWrapper
 *
 */

import { Suspense } from 'react';
import Hero from './components/Hero';
import Values from './components/Values';
// import LeverCareers from './components/LeverCareers';
import AshbyCareers from './components/AshbyCareers';
import Why from './components/Why';
import MaxWidth from '@shared/layouts/MaxWidth';
import pageMetaData from 'helpers/metadataHelper';
import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';

const meta = pageMetaData({
  title: 'Work with us | GoodParty.org',
  description:
    'GoodParty.org is building amazing, open-source social tools that empower the creative community to mobilize digital natives and have millions of people vote differently.',
  slug: '/work-with-us',
});
export const metadata = meta;

export const fetchJobs = async () => {
  try {
    const resp = await serverFetch(apiRoutes.jobs.list, undefined, {
      revalidate: 3600,
    });
    return resp.data;
  } catch (e) {
    console.log('error fetching jobs', e);
    return [];
  }
};

async function CareersWrapper() {
  const jobs = await fetchJobs();

  const childProps = {
    jobs,
  };

  return (
    <>
      <MaxWidth>
        <Hero />
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
