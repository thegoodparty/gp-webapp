'use client';
import Link from 'next/link';

import { getUserCookie } from '/helpers/cookieHelper';

import YellowButton from '../shared/buttons/YellowButton';
import RegisterAnimated from '../shared/inputs/RegisterAnimated';

export default function FollowOrRegister() {
  const user = getUserCookie();
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
