import React, { Suspense } from 'react';
import MaxWidth from '@shared/layouts/MaxWidth';
import Hero from './components/Hero';
import Team from './components/Team';
import Volunteers from './components/Volunteers';
import Interns from './components/Interns';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Team | GOOD PARTY',
  description:
    'Good Party’s core team are the people working full-time, part-time, or as dedicated volunteer contributors on our mission of making people matter more than money in our democracy.',
  slug: '/team',
});
export const metadata = meta;

export default function Page() {
  return (
    <MaxWidth>
      <Hero />
      <Suspense>
        <Team />
      </Suspense>
      <Suspense>
        <Interns />
      </Suspense>
      <Suspense>
        <Volunteers />
      </Suspense>
    </MaxWidth>
  );
}
