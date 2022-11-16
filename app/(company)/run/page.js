import { Suspense } from 'react';
import MaxWidth from '@shared/layouts/MaxWidth';
import Hero from './components/Hero';
import Tools from './components/Tools';
import CampaignWorks from './components/CampaignWorks';

export default async function Page(params) {
  return (
    <MaxWidth>
      <Hero />
      <Suspense>
        <Tools />
      </Suspense>
      <Suspense>
        <CampaignWorks />
      </Suspense>
    </MaxWidth>
  );
}
