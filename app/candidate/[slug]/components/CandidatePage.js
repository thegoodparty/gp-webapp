import MaxWidth from '@shared/layouts/MaxWidth';
import AboutSection from './AboutSection';
import Hero from './Hero';
import IssuesSection from './IssuesSection';
import StagedBanner from './StagedBanner';
import VictoryTracker from './VictoryTracker';
import WhySection from './WhySection';

export default function CandidatePage(props) {
  const { candidate, editMode, isStaged } = props;
  const color = '#734BDC';

  const childProps = {
    ...props,
    color,
  };

  return (
    <div className="bg-slate-100">
      <MaxWidth>
        {isStaged && <StagedBanner />}
        <div className="grid grid-cols-12 gap-6 pt-4">
          <div className="col-span-12 lg:col-span-9">
            <Hero {...childProps} />
            <AboutSection {...childProps} />
            <div className="lg:hidden">
              <VictoryTracker {...childProps} />
              <IssuesSection {...childProps} />
            </div>
            <WhySection {...childProps} />
          </div>
          <div className="col-span-12 lg:col-span-3 hidden lg:block">
            <VictoryTracker {...childProps} />
            <IssuesSection {...childProps} />
          </div>
        </div>
      </MaxWidth>
    </div>
  );
}
