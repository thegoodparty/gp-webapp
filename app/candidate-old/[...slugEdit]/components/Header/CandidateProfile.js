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
import { MdIosShare } from 'react-icons/md';
import PortalEditLink from './PortalEditLink';

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
          <div>
            <ShareCandidate candidate={candidate}>
              <MdIosShare
                size={30}
                style={{
                  color: '#868686',
                  marginLeft: '18px',
                  cursor: 'pointer',
                }}
              />
            </ShareCandidate>

            <PortalEditLink candidate={candidate} />
          </div>
        </div>
        {!isClaimed && <ClaimModal candidate={candidate} />}
      </div>
    </div>
  );
}

export default CandidateProfile;
