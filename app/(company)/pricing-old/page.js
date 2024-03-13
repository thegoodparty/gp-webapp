import { Suspense } from 'react';
import MaxWidth from '@shared/layouts/MaxWidth';
import Hero from './components/Hero';
import Plans from './components/Plans';
import pageMetaData from 'helpers/metadataHelper';

const meta = pageMetaData({
  title: 'Pricing Page',
  description:
    'Flexible plans to help grow and scale civic engagement campaigns',
  slug: '/pricing',
});
export const metadata = meta;

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
