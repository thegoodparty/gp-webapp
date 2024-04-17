import NoCampaign from './NoCampaign';

import CampaignsSection from './CampaignsSection';
import Paper from '@shared/utils/Paper';
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout';

const calcCampaignsDates = (dkCampaigns) => {
  const dates = [];
  dkCampaigns.forEach((campaign) => {
    if (campaign.status !== 'archived' && campaign.status !== 'completed') {
      dates.push({
        slug: campaign.slug,
        start: campaign.startDate,
        end: campaign.endDate,
      });
    }
  });
  return dates;
};

export default function DoorKnockingMainPage(props) {
  const { dkCampaigns } = props;
  const campaignDates = calcCampaignsDates(dkCampaigns);
  return (
    <DashboardLayout {...props}>
      {!dkCampaigns || dkCampaigns.length === 0 ? (
        <NoCampaign />
      ) : (
        <Paper>
          <CampaignsSection {...props} campaignDates={campaignDates} />
        </Paper>
      )}
    </DashboardLayout>
  );
}
