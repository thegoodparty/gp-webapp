// import HelpBanner from './HelpBanner';
// import HeroImg from './HeroImg';
import CandidateCard from './CandidateCard';
// import ContentSection from './ContentSection';

export default function OfficePage(props) {
  return (
    <div className="bg-black text-white">
      {/* <HelpBanner {...props} /> */}
      {/* <HeroImg /> */}
      <div className="max-w-[1440px] mx-auto px-4 xl:p-0 mt-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-3">
            <CandidateCard {...props} />
          </div>
          <div className="col-span-12 lg:col-span-9">
            <div>{/* <ContentSection {...props} /> */}2</div>
          </div>
        </div>
        <div id="candidate-footer" className="mb-4"></div>
        <div>&nbsp;</div>
      </div>
    </div>
  );
}
