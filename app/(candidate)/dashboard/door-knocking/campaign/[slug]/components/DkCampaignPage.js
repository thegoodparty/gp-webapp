'use client';

import H1 from '@shared/typography/H1';
import H3 from '@shared/typography/H3';
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout';
import StatisticsSection from './StatisticsSection';
import RoutesSection from './RoutesSection';

export default function DkCampaignPage(props) {
  const { dkCampaign, routes } = props;
  console.log('dkCampaign', dkCampaign);
  console.log('routes', routes);
  return (
    <DashboardLayout {...props}>
      <div className="bg-gray-50 border border-slate-300 p-3 md:py-6 md:px-8 rounded-xl">
        <StatisticsSection {...props} />
        <RoutesSection dkCampaign={dkCampaign} routes={routes} />
      </div>
    </DashboardLayout>
  );
}
