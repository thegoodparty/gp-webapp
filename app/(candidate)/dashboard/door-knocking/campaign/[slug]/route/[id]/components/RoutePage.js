import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout';
import CampaignSection from './CampaignSection';
import RouteStatisticsSection from './RouteStatisticsSection';
import ResidentsSection from './ResidentsSection';

export default function RoutePage(props) {
  return (
    <DashboardLayout {...props}>
      <CampaignSection {...props} />
      <RouteStatisticsSection {...props} />
      <ResidentsSection {...props} />
    </DashboardLayout>
  );
}
