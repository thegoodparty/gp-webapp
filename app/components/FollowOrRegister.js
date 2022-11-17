'use client';
import { useHookstate } from '@hookstate/core';

import Link from 'next/link';

import YellowButton from '@shared/buttons/YellowButton';
import RegisterAnimated from '@shared/inputs/RegisterAnimated';
import { globalUserState } from '@shared/layouts/navigation/NavProfileOrRegister';

export default function FollowOrRegister() {
  const userState = useHookstate(globalUserState);
  const user = userState.get();

  return (
    <>
      {user ? (
        <div>
          <br />
          <Link href="/candidates">
            <YellowButton>
              <div className="text-lg font-bold">Follow Candidates</div>
            </YellowButton>
          </Link>
        </div>
      ) : (
        <RegisterAnimated />
      )}
    </>
  );
}
