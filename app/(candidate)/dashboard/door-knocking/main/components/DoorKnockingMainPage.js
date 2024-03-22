'use client';
import DashboardLayout from '../../../shared/DashboardLayout';
import NoCampaign from './NoCampaign';
import H1 from '@shared/typography/H1';

import DkCampaignPreview from './DkCampaignPreview';

export default function DoorKnockingMainPage(props) {
  const { dkCampaigns } = props;

  console.log('dkCampaigns', dkCampaigns);
  return (
    <DashboardLayout {...props}>
      {!dkCampaigns || dkCampaigns.length === 0 ? (
        <NoCampaign />
      ) : (
        <div className="bg-white border border-slate-300 py-6 px-8 rounded-xl min-h-[calc(100vh-75px)]">
          <H1>Door Knocking Campaigns</H1>
          <div className="mt-6 grid grid-cols-12 gap-4">
            {dkCampaigns.map((campaign) => (
              <DkCampaignPreview campaign={campaign} key={campaign.slug} />
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
