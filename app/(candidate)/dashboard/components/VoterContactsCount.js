import H4 from '@shared/typography/H4';
import { numberFormatter } from 'helpers/numberHelper';
import {
  getVoterContactsGoal,
  getVoterContactsTotal,
} from 'app/(candidate)/dashboard/components/voterGoalsHelpers';

export const VoterContactsCount = ({ pathToVictory, reportedVoterGoals }) => (
  <H4>
    Your actions so far have earned you{' '}
    <strong>
      {numberFormatter(getVoterContactsTotal(reportedVoterGoals))} voter
      contacts
    </strong>{' '}
    out of{' '}
    <strong>
      {numberFormatter(getVoterContactsGoal(pathToVictory))} needed to win.
    </strong>
  </H4>
);
