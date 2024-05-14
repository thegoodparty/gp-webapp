import TitleSection from './TitleSection';
import VoterInfo from './VoterInfo';
import TabsSection from './TabsSection';
import VolunteerDashboardLayout from 'app/(volunteer)/volunteer-dashboard/shared/VolunteerDashboardLayout';
import MarkDoneFlow from './MarkDoneFlow';
import MobileOnlyWrapper from 'app/(volunteer)/volunteer-dashboard/door-knocking/components/MobileOnlyWrapper';
import StreetViewMap from './StreetViewMap';

export default function VolunteerAddressPage(props) {
  return (
    <VolunteerDashboardLayout {...props}>
      <MobileOnlyWrapper>
        <>
          <div className=" bg-white">
            <TitleSection {...props} />
            <StreetViewMap {...props} />
            <VoterInfo {...props} />
          </div>
          <div className="p-4">
            <TabsSection {...props} />
          </div>
          <MarkDoneFlow {...props} />
        </>
      </MobileOnlyWrapper>
    </VolunteerDashboardLayout>
  );
}
