import Chip from '@shared/utils/Chip';

// if a campaign status is complete or archived, return that status.
// else use the start and end date to determine if the campaign is active, upcoming  or passed

function calcCampaignStatus(campaign) {
  if (campaign.status === 'complete' || campaign.status === 'archived') {
    return campaign.status;
  }
  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);
  const currentDate = new Date();
  if (currentDate < startDate) {
    return 'upcoming';
  } else if (currentDate > endDate) {
    return 'passed';
  } else {
    return 'active';
  }
}

export default function CampaignStatusChip({ campaign }) {
  const campaignStatus = calcCampaignStatus(campaign);
  return (
    <Chip
      label={campaignStatus}
      className={`uppercase ${
        campaignStatus === 'active' ? 'bg-green-100 text-green-800  mr-2' : ''
      } ${
        campaignStatus === 'passed' || campaignStatus === 'upcoming'
          ? 'bg-gray-100 text-gray-800  mr-2'
          : ''
      } ${
        campaignStatus === 'archived' ? 'bg-primary text-white  mr-2' : ''
      }  ${
        campaignStatus === 'complete' ? 'bg-purple-100 text-purple-800' : ''
      }`}
    />
  );
}
