import RoutePreview from 'app/(candidate)/dashboard/door-knocking/campaign/[slug]/components/RoutePreview';
import ClaimButton from './ClaimButton';
import ResidentsSection from './ResidentsSection';
import VolunteerDashboardLayout from 'app/(volunteer)/volunteer-dashboard/shared/VolunteerDashboardLayout';
import TitleSection from './TitleSection';

export default function VolunteerRoutePage(props) {
  const { route } = props;
  return (
    <VolunteerDashboardLayout {...props}>
      <div className="p-4 bg-white">
        <TitleSection {...props} />
        <RoutePreview route={route} noCard />
        <ClaimButton {...props} />
      </div>
      <div className="p-4">
        <ResidentsSection {...props} />
      </div>
    </VolunteerDashboardLayout>
  );
}
