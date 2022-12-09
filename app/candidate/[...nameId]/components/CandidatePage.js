import MaxWidth from '@shared/layouts/MaxWidth';
import { Suspense } from 'react';
import BioSection from './BioSection';
import CampaignProgress from './CampaignProgress';
import CandidateFeed from './CandidateFeed';
import DateBox from './DateBox';
import Endorsements from './Endorsements';
import Header from './Header';
import Trending from './Trending';

const rightSide = (props) => {
  return (
    <>
      <Suspense>
        <Endorsements {...props} />{' '}
      </Suspense>
      <Suspense>
        <DateBox {...props} />
      </Suspense>
      <Suspense>
        <CampaignProgress {...props} />
      </Suspense>
      <Suspense>
        <DateBox {...props} showPast />
      </Suspense>
    </>
  );
};

export default function CandidatePage(props) {
  return (
    <MaxWidth>
      <Header {...props} />
      <div className="grid gap-12 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense>
            <BioSection {...props} />
          </Suspense>
          <Suspense>
            <Trending {...props} />
          </Suspense>
          <div className="lg:hidden">{rightSide(props)}</div>
          <Suspense>
            <CandidateFeed {...props} />
          </Suspense>
        </div>
        <div className="hidden lg:block">{rightSide(props)}</div>
      </div>
      <div className="mb-4"></div>
    </MaxWidth>
  );
}
