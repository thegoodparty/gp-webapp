import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import Overline from '@shared/typography/Overline';
import Paper from '@shared/utils/Paper';
import { IoArrowForward } from 'react-icons/io5';
import ScheduleFlow from './ScheduleFlow';

export default function ScheduleCard(props) {
  return (
    <Paper className="h-full flex flex-col justify-between">
      <div>
        <H3>Schedule a campaign</H3>
        <Overline className="text-gray-600 mb-4">Resources</Overline>
        <Body2>
          Connect with our Politics team to schedule a phone banking campaign.
          Attach your script and pay just $.04 per outbound call. Automatically
          leave voicemails for one and a half cents.
        </Body2>
      </div>
      <ScheduleFlow {...props} />
    </Paper>
  );
}
