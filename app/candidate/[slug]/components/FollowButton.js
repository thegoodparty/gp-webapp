'use client';

import { candidateColor } from 'helpers/candidateHelper';
import { useHookstate, hookstate } from '@hookstate/core';
import { globalUserState } from '@shared/layouts/navigation/NavRegisterOrProfile';
import { getUserCookie } from 'helpers/cookieHelper';
import gpFetch from 'gpApi/gpFetch';
import { useEffect, useState } from 'react';
import gpApi from 'gpApi';
import AlertDialog from '@shared/utils/AlertDialog';
import { useRouter } from 'next/navigation';
import { FaThumbsUp } from 'react-icons/fa';

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

// export const followOffsetState = hookstate(0);

export default function FollowButton({ candidate, color, textColor }) {
  const brightColor = candidateColor(candidate);
  const userState = useHookstate(globalUserState);
  // const followOffset = useHookstate(followOffsetState);
  const user = userState.get();
  const [follows, setFollows] = useState({});
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const router = useRouter();

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
      // followOffset.set((offset) => offset + 1);
    } else {
      router.push('register');
    }
  };

  const isFollowed = follows && follows[candidate.id];

  const handleDelete = async () => {
    if (user) {
      await deleteFollowCandidate(candidate.id);
      const { supports } = await loadUserFollows();
      setFollows(supports);
      // followOffset.set((offset) => offset - 1);
    }
    setShowDeleteAlert(false);
  };

  return (
    <>
      {isFollowed ? (
        <div
          className="flex items-center justify-between py-2 px-4 mt-2 rounded-md cursor-pointer"
          id="candidate-follow-button"
          onClick={() => setShowDeleteAlert(true)}
          style={{ backgroundColor: color, color: textColor }}
        >
          <div className="">
            <div className="flex-1 font-black text-xl tracking-wider">
              FOLLOWING
            </div>
            <div className="mt-1">
              Thank you for following {candidate.firstName} {candidate.lastName}
              !
            </div>
          </div>
          <div className="text-2xl" style={{ color }}>
            <FaThumbsUp />
          </div>
        </div>
      ) : (
        <div
          className="flex items-center justify-between bg-white py-2 px-4 mt-2 rounded-md cursor-pointer"
          id="candidate-follow-button"
          onClick={handleFollow}
        >
          <div className="">
            <div className="flex-1 font-black text-xl tracking-wider">
              FOLLOW
            </div>
            <div className="mt-1">Follow this campaign to stay in the loop</div>
          </div>
          <div className="text-2xl" style={{ color }}>
            <FaThumbsUp />
          </div>
        </div>
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
