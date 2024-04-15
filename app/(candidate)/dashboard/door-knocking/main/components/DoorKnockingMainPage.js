import NoCampaign from './NoCampaign';
import H1 from '@shared/typography/H1';

import CampaignsSection from './CampaignsSection';
import AddCampaign from './AddCampaign';
import Body2 from '@shared/typography/Body2';
import { BsPlusCircleFill } from 'react-icons/bs';
import Paper from '@shared/utils/Paper';
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout';

const calcCampaignsDates = (dkCampaigns) => {
  const dates = [];
  dkCampaigns.forEach((campaign) => {
    dates.push({
      slug: campaign.slug,
      start: campaign.startDate,
      end: campaign.endDate,
    });
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
          <div className="flex justify-between items-center">
            <div>
              <H1>Door Knocking Campaigns</H1>
              <Body2>All of your campaigns in one place.</Body2>
            </div>
            <AddCampaign
              buttonLabel={
                <div className="flex items-center">
                  <BsPlusCircleFill /> <div className="ml-2">New Campaign</div>
                </div>
              }
              campaignDates={campaignDates}
            />
          </div>
          <CampaignsSection {...props} campaignDates={campaignDates} />
        </Paper>
      )}
    </DashboardLayout>
  );
}
