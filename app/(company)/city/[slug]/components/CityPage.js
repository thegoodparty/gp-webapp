import MaxWidth from '@shared/layouts/MaxWidth';
// import HeroSection from './HeroSection';
// import CandidateSection from './CandidateSection';
// import CtaSection from './CtaSection';
// import MeetingSection from './MeetingSection';
// import BlogSection from './BlogSection';

export default function CityPage(props) {
  const { city } = props;

  const childProps = {
    ...props,
  };

  return (
    <div className="bg-slate-50 pb-5">
      {/* <HeroSection {...childProps} />
        <CandidateSection {...childProps} />
        <CtaSection {...childProps} />
        <MeetingSection {...childProps} /> */}
    </div>
  );
}
