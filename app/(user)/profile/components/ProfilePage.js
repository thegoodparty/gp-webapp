import React, { Suspense } from 'react';
import LoadingAnimation from '@shared/utils/LoadingAnimation';
import Link from 'next/link';
import UserAvatar from '@shared/user/UserAvatar';
import LogoutSection from './LogoutSection';
import CandidatesSection from './CandidatesSection';
import { getServerUser } from 'helpers/userServerHelper';
import RunCampaignButton from 'app/(company)/run-for-office/components/RunCampaignButton';

export default function ProfilePage() {
  const user = getServerUser();
  return (
    <>
      <div className="py-0 px-4 lg:p-0 w-full">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-9">
            <div className="row">
              <UserAvatar user={user} size="large" />
              <div className="ml-6">
                <h3
                  className="text-xl tracking-wide font-black mb-2"
                  data-cy="profile-username"
                >
                  {user.name}
                </h3>
                <Link
                  href="/profile/settings"
                  passHref
                  className="underline"
                  data-cy="profile-edit-link"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <LogoutSection />
          </div>
        </div>
      </div>
      <div className="mt-6 mb-3 flex items-center">
        <RunCampaignButton id="profile-run-for-office" label="Run For Office" />
      </div>
      <Suspense>
        <CandidatesSection />
      </Suspense>
    </>
  );
}
