import MaxWidth from '@shared/layouts/MaxWidth';
import { Suspense } from 'react';
import BioSection from './BioSection';
import Header from './Header';
import Trending from './Trending';

export default function CandidatePage(props) {
  return (
    <MaxWidth>
      <Header {...props} />
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense>
            <BioSection {...props} />
          </Suspense>
          <Suspense>
            <Trending {...props} />
          </Suspense>
        </div>
        <div>right side</div>
      </div>
    </MaxWidth>
  );
}
