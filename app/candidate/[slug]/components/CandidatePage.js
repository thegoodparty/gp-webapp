import MaxWidth from '@shared/layouts/MaxWidth';
import Hero from './Hero';
import StagedBanner from './StagedBanner';

export default function CandidatePage(props) {
  const { candidate, editMode, isStaged } = props;
  return (
    <MaxWidth>
      {isStaged && <StagedBanner />}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9">
          <Hero {...props} />
        </div>
        <div className="col-span-12 lg:col-span-3 hidden lg:block"></div>
      </div>
    </MaxWidth>
  );
}
