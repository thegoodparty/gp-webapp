'use client';

import DashboardLayout from '../../shared/DashboardLayout';
import CampaignSection from './CampaignSection';
import DetailsSection from './DetailsSection';

const sections = [];

export default function DetailsPage(props) {
  return (
    <DashboardLayout {...props}>
      <div className="max-w-[940px] mx-auto bg-gray-50 rounded-xl px-6 py-5">
        <DetailsSection {...props} />
        <CampaignSection {...props} />
      </div>
    </DashboardLayout>
  );
}
