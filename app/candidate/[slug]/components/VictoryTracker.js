import GoalsChart from '@shared/candidates/GoalsChart';
import FaqLink from '@shared/content/FaqLink';
import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';

import { kFormatter, numberFormatter } from 'helpers/numberHelper';

// import GoalsChart from 'components/candidate-portal/CandidatePortalHomeWrapper/GoalsChart';

function VictoryTracker({ candidate, color }) {
  const { voteGoal, voterProjection } = candidate;

  return (
    <div className="relative z-10">
      <GoalsChart candidate={candidate} color={color} />
      <div className="flex justify-center mb-6">
        <div className="text-right" data-cy="campaign-likely-voters">
          <H3>{kFormatter(voterProjection)}</H3>
          <Body2>Likely Voters</Body2>
        </div>
        <div className="w-20" />
        <div data-cy="campaign-needed-votes">
          <H3>{kFormatter(voteGoal)}</H3>
          <Body2>needed to win</Body2>
        </div>
      </div>
    </div>
  );
}

export default VictoryTracker;
