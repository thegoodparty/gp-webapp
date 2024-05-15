import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout';
import RouteStatisticsSection from './RouteStatisticsSection';
import ResidentsSection from './ResidentsSection';
import Breadcrumbs from '@shared/utils/Breadcrumbs';

export default function RoutePage(props) {
  const { route, dkCampaign } = props;
  console.log('dkCampaign', dkCampaign);
  const res = route.data?.response?.routes[0];
  const { summary } = res;
  const breadcrumbsLinks = [
    { href: `/dashboard/door-knocking/main`, label: 'Door Knocking' },
    {
      href: `/dashboard/door-knocking/campaign/${dkCampaign.slug}`,
      label: `${dkCampaign.name} Campaign`,
    },
    {
      label: `${summary} Route`,
    },
  ];
  return (
    <DashboardLayout {...props}>
      <Breadcrumbs links={breadcrumbsLinks} />
      <RouteStatisticsSection {...props} />
      <ResidentsSection {...props} />
    </DashboardLayout>
  );
}
