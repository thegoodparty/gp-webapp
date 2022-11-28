/**
 *
 * CandidateProfile
 *
 */

import CandidateAvatar from '@shared/candidates/CandidateAvatar';
import { partyRace } from 'helpers/candidateHelper';
import ClaimModal from './ClaimModal';
import FollowButton from './FollowButton';
import ShareCandidate from './ShareCandidate';

function CandidateProfile({ candidate, showShareModalCallback }) {
  const { firstName, lastName, isClaimed } = candidate;

  return (
    <div className="flex items-center">
      <CandidateAvatar candidate={candidate} priority />
      <div className="ml-8 lg:ml-9">
        <h1 className="text-4xl font-black mb-3" data-cy="candidate-name">
          {firstName}
          <br />
          {lastName}
        </h1>
        <h1 className="text-base" data-cy="candidate-race">
          {partyRace(candidate)}
        </h1>
        <div className="hidden lg:flex lg:items-center">
          <FollowButton candidate={candidate} />
          <ShareCandidate candidate={candidate} />
        </div>
        {!isClaimed && <ClaimModal candidate={candidate} />}
      </div>
    </div>
  );
}

export default CandidateProfile;
