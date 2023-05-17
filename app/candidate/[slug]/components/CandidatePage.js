import MaxWidth from '@shared/layouts/MaxWidth';
import AboutSection from './AboutSection';
import Hero from './Hero';
import IssuesSectionWithEdit from './IssuesSectionWithEdit';
import ReviewBanner from './ReviewBanner';
import SocialSectionWithEdit from './SocialSectionWithEdit';
import StagedBanner from './StagedBanner';
import VictoryTracker from './VictoryTracker';
import WhySection from './WhySection';

function pickTextColorBasedOnBg(
  bgColor,
  lightColor = '#fff',
  darkColor = '#000',
) {
  var color =
    bgColor.toString().charAt(0) === '#'
      ? bgColor.toString().substring(1, 7)
      : bgColor;

  var r = parseInt(color.substring(0, 2), 16); // hexToR
  var g = parseInt(color.substring(2, 4), 16); // hexToG
  var b = parseInt(color.substring(4, 6), 16); // hexToB
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? darkColor : lightColor;
}

export default function CandidatePage(props) {
  const { candidate, isStaged, reviewMode } = props;
  let color = props.color || candidate.color || '#734BDC';
  if (!props.color && candidate.color?.color) {
    // old candidates
    color = candidate.color.color;
  }
  const textColor = pickTextColorBasedOnBg(color);

  const childProps = {
    ...props,
    color,
    textColor,
  };

  return (
    <div className="bg-slate-100">
      <MaxWidth>
        {isStaged && <StagedBanner />}
        {reviewMode && <ReviewBanner {...props} />}
        <div className="grid grid-cols-12 gap-6 pt-4">
          <div className="col-span-12 lg:col-span-9">
            <Hero {...childProps} />
            <AboutSection {...childProps} />
            <SocialSectionWithEdit {...childProps} />
            <div className="lg:hidden">
              <VictoryTracker {...childProps} />
              <IssuesSectionWithEdit {...childProps} />
            </div>
            <WhySection {...childProps} />
          </div>
          <div className="col-span-12 lg:col-span-3 hidden lg:block">
            <VictoryTracker {...childProps} />
            <IssuesSectionWithEdit {...childProps} />
          </div>
        </div>
      </MaxWidth>
    </div>
  );
}
