import H3 from '@shared/typography/H3';
import Paper from '@shared/utils/Paper';
import TempRequest from './TempRequest';
import Body1 from '@shared/typography/Body1';
import CreateTextingProject from './CreateTextingProject';

export default function TempStartCampaign(props) {
  return (
    <Paper>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6">
          Normally a user will only get here after their request was approved
          and paid for.
          <br /> Since this is an admin flow for now, we will create a campaign
          with a fake request.
          <Body1 className="my-4">
            The creation of the campaign will also be automated by the time the
            user gets here.
          </Body1>
          <CreateTextingProject />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <H3>Approved Request</H3>
          <TempRequest {...props} />
        </div>
      </div>
    </Paper>
  );
}
