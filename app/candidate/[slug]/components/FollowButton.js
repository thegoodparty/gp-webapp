'use client';

import { candidateColor } from 'helpers/candidateHelper';
import { useHookstate, hookstate } from '@hookstate/core';
import { globalUserState } from '@shared/layouts/navigation/RegisterOrProfile';
import { getUserCookie, setCookie } from 'helpers/cookieHelper';
import gpFetch from 'gpApi/gpFetch';
import { useEffect, useState } from 'react';
import gpApi from 'gpApi';
import AlertDialog from '@shared/utils/AlertDialog';
import { useRouter } from 'next/navigation';
import { FaShare } from 'react-icons/fa';
import SecondaryButton from '@shared/buttons/SecondaryButton';

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
      setCookie('returnUrl', `/candidate/${candidate.slug}`);
      router.push('/register');
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
          id="candidate-follow-button"
          onClick={() => setShowDeleteAlert(true)}
        >
          <SecondaryButton variant="outlined" size="medium">
            <span className="font-medium">Following</span>
          </SecondaryButton>
        </div>
      ) : (
        <div id="candidate-follow-button" onClick={handleFollow}>
          <SecondaryButton size="medium">
            <span className="font-medium">Follow</span>
          </SecondaryButton>
        </div>
      )}

      <AlertDialog
        open={showDeleteAlert}
        handleClose={() => setShowDeleteAlert(false)}
        title={'Unfollow?'}
        ariaLabel={'Unfollow?'}
        description={'Are you sure you want to unfollow this candidate?'}
        handleProceed={handleDelete}
        redButton={false}
      />
    </>
  );
}
