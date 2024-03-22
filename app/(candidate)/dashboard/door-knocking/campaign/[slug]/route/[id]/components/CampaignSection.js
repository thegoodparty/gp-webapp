import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import Paper from 'app/(candidate)/dashboard/door-knocking/shared/Paper';
import { dateUsHelper } from 'helpers/dateHelper';

export default function CampaignSection({ dkCampaign, route }) {
  const { name, endDate, startDate } = dkCampaign;
  const res = route.data?.response?.routes[0];
  const { summary } = res;
  return (
    <Paper>
      <H2>
        {name} | {summary} Route
      </H2>
      <Body2>
        {dateUsHelper(startDate)} - {dateUsHelper(endDate)}.
      </Body2>
    </Paper>
  );
}
