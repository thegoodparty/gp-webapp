import Link from 'next/link';

import YellowButton from '@shared/buttons/YellowButton';
import RegisterAnimated from '@shared/inputs/RegisterAnimated';
import { getServerUser } from 'helpers/userServerHelper';

export default function FollowOrRegister() {
  const user = getServerUser();

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
