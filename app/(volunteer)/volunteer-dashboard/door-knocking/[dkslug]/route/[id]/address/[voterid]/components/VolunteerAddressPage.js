import TitleSection from './TitleSection';
import VoterInfo from './VoterInfo';
import TabsSection from './TabsSection';
import VolunteerDashboardLayout from 'app/(volunteer)/volunteer-dashboard/shared/VolunteerDashboardLayout';
import MarkDoneFlow from './MarkDoneFlow';

export default function VolunteerAddressPage(props) {
  return (
    <VolunteerDashboardLayout {...props}>
      <div className=" bg-white">
        <TitleSection {...props} />
        <VoterInfo {...props} />
      </div>
      <div className="p-4">
        <TabsSection {...props} />
      </div>
      <MarkDoneFlow {...props} />
    </VolunteerDashboardLayout>
  );
}
