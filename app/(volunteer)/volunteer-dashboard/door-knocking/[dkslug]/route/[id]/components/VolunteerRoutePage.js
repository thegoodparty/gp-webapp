import RoutePreview from 'app/(candidate)/dashboard/door-knocking/campaign/[slug]/components/RoutePreview';
import ClaimButton from './ClaimButton';
import ResidentsSection from './ResidentsSection';
import VolunteerDashboardLayout from 'app/(volunteer)/volunteer-dashboard/shared/VolunteerDashboardLayout';
import TitleSection from './TitleSection';
import MobileOnlyWrapper from 'app/(volunteer)/volunteer-dashboard/door-knocking/components/MobileOnlyWrapper';

export default function VolunteerRoutePage(props) {
  return (
    <VolunteerDashboardLayout {...props}>
      <MobileOnlyWrapper>
        <div className="p-4 bg-white">
          <TitleSection {...props} />
          <RoutePreview {...props} noCard allowDynamic />
          <ClaimButton {...props} />
        </div>
        <div className="p-4">
          <ResidentsSection {...props} />
        </div>
      </MobileOnlyWrapper>
    </VolunteerDashboardLayout>
  );
}
