import CandidateAvatar from '@shared/candidates/CandidateAvatar';
import VictoryTracker from './VictoryTracker';
import QuestionButton from '@shared/buttons/QuestionButton';
import Link from 'next/link';

export default function AvatarWithTracker(props) {
  const { candidate, editMode, candidateUrl, priority } = props;
  return (
    <div className="relative">
      <div className="absolute -top-4 right-4 z-20">
        <QuestionButton
          className={
            candidateUrl
              ? `text-indigo-50 text-2xl`
              : `text-indigo-800 text-2xl`
          }
        >
          <div className="max-w-md">
            This meter offers GoodParty.org&apos;s latest projections of the
            number of likely votes a candidate would get if the elections was
            held today, and how many votes needed to win on election day. We
            continuously update our projections using a range of data sources
            including polling, market signals and previous election data.
          </div>
        </QuestionButton>
      </div>

      <div>
        <VictoryTracker {...props} />
      </div>
      <div className="absolute top-3 w-full left-0 z-20 flex justify-center">
        <div className={editMode ? 'opacity-60' : ''}>
          {candidateUrl ? (
            <Link href={candidateUrl}>
              <CandidateAvatar candidate={candidate} priority={priority} />
            </Link>
          ) : (
            <CandidateAvatar candidate={candidate} priority={priority} />
          )}
        </div>
      </div>
    </div>
  );
}
