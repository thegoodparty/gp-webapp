'use client';

import H1 from '@shared/typography/H1';
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout';

export default function DkCampaignPage(props) {
  const { dkCampaign } = props;
  return (
    <DashboardLayout {...props}>
      <div className="bg-gray-50 border border-slate-300 py-6 px-8 rounded-xl">
        <H1>{dkCampaign.name}</H1>
      </div>
    </DashboardLayout>
  );
}
