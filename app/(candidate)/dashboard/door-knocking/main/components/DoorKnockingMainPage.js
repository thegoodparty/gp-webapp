import DashboardLayout from '../../../shared/DashboardLayout';
import NoCampaign from './NoCampaign';
import H1 from '@shared/typography/H1';

import DkCampaignPreview from './DkCampaignPreview';
import Paper from '../../shared/Paper';
import gpApi from 'gpApi';
import CampaignsSection from './CampaignsSection';
import { Add } from '@mui/icons-material';
import AddCampaign from './AddCampaign';
import Body2 from '@shared/typography/Body2';
import { BsPlusCircleFill } from 'react-icons/bs';

export default function DoorKnockingMainPage(props) {
  const { dkCampaigns } = props;

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
            />
          </div>
          <CampaignsSection {...props} />
        </Paper>
      )}
    </DashboardLayout>
  );
}
