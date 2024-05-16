'use client';

import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout';
import StatisticsSection from './StatisticsSection';
import RoutesSection from './RoutesSection';

export default function DkCampaignPage(props) {
  return (
    <DashboardLayout {...props}>
      <div className="bg-gray-50 border border-slate-300 p-3 md:py-6 md:px-8 rounded-xl">
        <StatisticsSection {...props} />
        <RoutesSection {...props} />
      </div>
    </DashboardLayout>
  );
}
