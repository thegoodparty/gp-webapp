
import React, { Suspense } from 'react';
import LoadingAnimation from '@shared/utils/LoadingAnimation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import UserAvatar from '@shared/user/UserAvatar';
import LogoutSection from './LogoutSection';
import CandidatesSection from './CandidatesSection';

export default function ProfilePage() {
  const nextCookies = cookies();
  const user = JSON.parse(nextCookies.get('user').value);
  return (
    <>
      <div className="py-0 px-4 lg:p-0 w-full">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-9">
            <div className="row">
              <UserAvatar user={user} size="large" />
              <div className="ml-6">
                  <h3
                      className="text-[22px] tracking-wide font-black mb-2"
                      data-cy="profile-username"
                  >
                    {user.name}
                  </h3>
                  <Link href="/profile/settings" passHref className="underline" data-cy="profile-edit-link">
                      Edit
                  </Link>
              </div>
          </div>
          </div>
          <div class="col-span-3">
            <LogoutSection />
          </div>
        </div>
      </div>
      <Suspense fallback={<LoadingAnimation fullPage={false} />}>
        <CandidatesSection />
      </Suspense>
    </>
  );
}
  