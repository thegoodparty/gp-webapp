'use client';

import DashboardLayout from '../../shared/DashboardLayout';
import CampaignSection from './CampaignSection';
import DetailsSection from './DetailsSection';
import FunFactSection from './FunFactSection';
import RunningAgainstSection from './RunningAgainstSection';
import WhySection from './WhySection';

const sections = [];

export default function DetailsPage(props) {
  return (
    <DashboardLayout {...props}>
      <div className="max-w-[940px] mx-auto bg-gray-50 rounded-xl px-6 py-5">
        <DetailsSection {...props} />
        <CampaignSection {...props} />
        <RunningAgainstSection {...props} />
        <WhySection {...props} />
        <FunFactSection {...props} />
      </div>
    </DashboardLayout>
  );
}
