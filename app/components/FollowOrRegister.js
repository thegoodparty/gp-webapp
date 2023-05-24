'use client';
import Link from 'next/link';

import YellowButton from '@shared/buttons/YellowButton';
import RegisterAnimated from '@shared/inputs/RegisterAnimated';
import { globalUserState } from '@shared/layouts/navigation/RegisterOrProfile';
import { useHookstate } from '@hookstate/core';

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
