import TitleSection from './TitleSection';
import VoterInfo from './VoterInfo';
import TabsSection from './TabsSection';
import VolunteerDashboardLayout from 'app/(volunteer)/volunteer-dashboard/shared/VolunteerDashboardLayout';

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
    </VolunteerDashboardLayout>
  );
}
