'use client';

import { candidateColor } from 'helpers/candidateHelper';
import { useHookstate, hookstate } from '@hookstate/core';
import { globalUserState } from '@shared/layouts/navigation/NavRegisterOrProfile';
import { getCookie, getUserCookie } from 'helpers/cookieHelper';
import gpFetch from 'gpApi/gpFetch';
import { Suspense, use, useEffect, useState } from 'react';
import gpApi from 'gpApi';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import BlackOutlinedButtonClient from '@shared/buttons/BlackOutlinedButtonClient';
import { ImCheckmark } from 'react-icons/im';
import RegisterModal from '@shared/layouts/RegisterModal';
import AlertDialog from '@shared/utils/AlertDialog';

const loadUserFollows = async () => {
  const user = getUserCookie();
  if (user) {
    const api = gpApi.user.follow.list;
    return await gpFetch(api, false, 3600);
  }
  return false;
};

const followCandidate = async (candidateId) => {
  const api = gpApi.user.follow.create;
  return await gpFetch(api, { candidateId });
};

const deleteFollowCandidate = async (candidateId) => {
  const api = gpApi.user.follow.delete;
  return await gpFetch(api, { candidateId });
};

export const followOffsetState = hookstate(0);

export default function FollowButton({ candidate }) {
  const brightColor = candidateColor(candidate);
  const userState = useHookstate(globalUserState);
  const followOffset = useHookstate(followOffsetState);
  const user = userState.get();
  const [follows, setFollows] = useState({});
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {
    loadUserFollows().then((res) => {
      const { supports } = res;
      if (supports) {
        setFollows(supports);
      }
    });
  }, []);

  const handleFollow = async () => {
    if (user) {
      await followCandidate(candidate.id);
      const { supports } = await loadUserFollows();
      setFollows(supports);
      followOffset.set((offset) => offset + 1);
    } else {
      setShowRegisterModal(true);
    }
  };

  const isFollowed = follows && follows[candidate.id];

  const handleDelete = async () => {
    if (user) {
      await deleteFollowCandidate(candidate.id);
      const { supports } = await loadUserFollows();
      setFollows(supports);
      followOffset.set((offset) => offset - 1);
    }
    setShowDeleteAlert(false);
  };

  return (
    <>
      {isFollowed ? (
        <BlackOutlinedButtonClient
          style={{
            color: brightColor,
            borderColor: brightColor,
            marginTop: '12px',
          }}
          id="candidate-follow-button"
          onClick={() => setShowDeleteAlert(true)}
        >
          <div className="row">
            <ImCheckmark />
            <div className="font-black">&nbsp; FOLLOWING</div>
          </div>
        </BlackOutlinedButtonClient>
      ) : (
        <BlackButtonClient
          style={{
            backgroundColor: brightColor,
            borderColor: brightColor,
            marginTop: '12px',
          }}
          id="candidate-follow-button"
          onClick={handleFollow}
        >
          <div className="font-black">FOLLOW</div>
        </BlackButtonClient>
      )}

      {showRegisterModal && (
        <Suspense>
          <RegisterModal
            closeModalCallback={() => {
              setShowRegisterModal(false);
            }}
          />
        </Suspense>
      )}
      <AlertDialog
        open={showDeleteAlert}
        handleClose={() => setShowDeleteAlert(false)}
        title={'Unfollow?'}
        ariaLabel={'Unfollow?'}
        description={'Are you sure you want to unfollow this candidate?'}
        handleProceed={handleDelete}
      />
    </>
  );
}
