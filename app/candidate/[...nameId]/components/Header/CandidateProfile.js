/**
 *
 * CandidateProfile
 *
 */

// import React, { useContext, useState } from 'react';
// import { MdIosShare } from 'react-icons/md';

// import FollowButtonContainer from '/containers/shared/FollowButtonContainer';

// import Row from '../../shared/Row';
// import { partyRace } from '/helpers/candidatesHelper';
// import Modal from '../../shared/Modal';
// import ClaimModal from './ClaimModal';
// import { CandidateWrapperContext } from '../index';
import CandidateAvatar from '@shared/candidates/CandidateAvatar';
import { partyRace } from 'helpers/candidateHelper';

function CandidateProfile({ candidate, showShareModalCallback }) {
  // const { candidate } = useContext(CandidateContext);

  // const { afterFollowCallback, afterUnfollowCallback } = useContext(
  //   CandidateWrapperContext,
  // );

  const { firstName, lastName, isClaimed } = candidate;
  // const [showModal, setShowModal] = useState(false);

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
        {/* <ButtonWrapper>
          <FollowButtonContainer
            candidate={candidate}
            afterFollowCallback={afterFollowCallback}
            afterUnfollowCallback={afterUnfollowCallback}
          />
          <MdIosShare
            size={30}
            style={{ color: '#868686', marginLeft: '18px', cursor: 'pointer' }}
            onClick={showShareModalCallback}
          />
        </ButtonWrapper>
        {!isClaimed && (
          <Claim data-cy="candidate-claimed">
            Is this you?{' '}
            <ClaimLink
              onClick={() => setShowModal(true)}
              data-cy="candidate-claim-page"
            >
              Claim this page
            </ClaimLink>
          </Claim>
        )} */}
      </div>
      {/* <Modal closeModalCallback={() => setShowModal(false)} open={showModal}>
        <ClaimModal closeModalCallback={() => setShowModal(false)} />
      </Modal> */}
    </div>
  );
}

export default CandidateProfile;
