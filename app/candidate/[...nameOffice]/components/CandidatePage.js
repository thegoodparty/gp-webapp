import HelpBanner from './HelpBanner';
import HeroImg from './HeroImg';
import CandidateCard from './CandidateCard';

export default function CandidatePage(props) {
  return (
    <div className="bg-black text-white">
      <HelpBanner {...props} />
      <HeroImg />
      <div className="max-w-[1440px] mx-auto px-4 xl:p-0 mt-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-3">
            <CandidateCard {...props} />
          </div>
          <div className="col-span-12 lg:col-span-9">2</div>
        </div>
      </div>
    </div>
  );
}
