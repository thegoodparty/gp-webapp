import Pill from '@shared/buttons/Pill';
import GoalsChart from '@shared/candidates/GoalsChart';
import FaqLink from '@shared/content/FaqLink';
import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';

import { kFormatter, numberFormatter } from 'helpers/numberHelper';
import Image from 'next/image';

// import GoalsChart from 'components/candidate-portal/CandidatePortalHomeWrapper/GoalsChart';

function VictoryTracker({ candidate, color }) {
  const { voteGoal, voterProjection, finalVotes } = candidate;
  let isWon = false;
  let progress = voterProjection;
  if (finalVotes && finalVotes > voteGoal) {
    isWon = true;
    progress = finalVotes;
  }

  return (
    <div className="relative z-10">
      <GoalsChart candidate={candidate} color={color} />
      {isWon && (
        <div className="absolute top-[160px] right-[26px] rotate-[30deg]">
          <Image src="/images/heart.svg" width={25} height={20} alt="win" />
        </div>
      )}
      <div className="flex justify-center mb-6">
        <div
          className="flex flex-col items-center"
          data-cy="campaign-likely-voters"
        >
          <H3 className="text-center">{kFormatter(progress)}</H3>
          <Body2 className="text-indigo-50 text-center">
            {finalVotes ? 'Final Votes' : 'Likely Votes Today'}
          </Body2>
        </div>
        <div className={finalVotes ? 'w-14' : 'w-11'} />
        <div data-cy="campaign-needed-votes flex flex-col items-center justify-center">
          <H3 className="text-center">{kFormatter(voteGoal)}</H3>
          <Body2 className="text-indigo-50 text-center">
            Votes Needed to Win
          </Body2>
        </div>
      </div>
      {finalVotes && (
        <div className="my-3 flex justify-center">
          {isWon ? (
            <div className=" bg-lime-500 text-primary py-2 px-4 rounded-full">
              Winner with {numberFormatter(finalVotes)} votes{' '}
              <span role="img" aria-label="Party">
                🎉️
              </span>
            </div>
          ) : (
            <div className=" bg-indigo-500 text-gray-400 py-2 px-4 rounded-full">
              Race concluded with {numberFormatter(finalVotes)} votes
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VictoryTracker;
