import MaxWidth from '@shared/layouts/MaxWidth';
import CtaSection from './CtaSection';
import ProfileSection from './ProfileSection';
import ReviewBanner from './ReviewBanner';
import StagedBanner from './StagedBanner';
import TabsSection from './tabs/TabsSection';

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
    <div className="bg-slate-50 pb-5">
      <MaxWidth>
        {isStaged && <StagedBanner />}
        {reviewMode && <ReviewBanner {...props} />}
        <div className="lg:flex">
          <div className="lg:basis-[350px]">
            <ProfileSection {...childProps} />
          </div>
          <div className="lg:flex-1 lg:pl-36 max-w-[786px]">
            <CtaSection {...childProps} />
            <TabsSection {...childProps} />
          </div>
        </div>
      </MaxWidth>
    </div>
  );
}
