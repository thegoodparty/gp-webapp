import AboutCard from './AboutCard';
import FreeToolsCard from './FreeToolsCard';
import OfficeCard from './OfficeCard';
import P2vCard from './P2vCard';
import TargetCard from './TargetCard';
import TopIssuesCard from './TopIssuesCard';

export default function ContentSection(props) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-6">
        <P2vCard {...props} />
      </div>
      <div className="col-span-12 md:col-span-6">
        <TargetCard {...props} />
      </div>
      <div className="col-span-12">
        <FreeToolsCard />
      </div>
      <div className="col-span-12 md:col-span-6">
        <AboutCard {...props} />
      </div>
      <div className="col-span-12 md:col-span-6">
        <OfficeCard {...props} />
        <TopIssuesCard {...props} />
      </div>
    </div>
  );
}
