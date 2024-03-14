'use client';
import Body1 from '@shared/typography/Body1';
import H3 from '@shared/typography/H3';

import Invitation from './Invitation';
import { useState } from 'react';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

async function fetchInvitations() {
  try {
    const api = gpApi.campaign.volunteerInvitation.listByUser;

    return await gpFetch(api);
  } catch (e) {
    console.log('error at fetchInvitations', e);
    return {};
  }
}

export default function InvitationsPage(props) {
  const [invitations, setInvitations] = useState(props.invitations);

  const reloadInvitations = async () => {
    const res = await fetchInvitations();
    setInvitations(res.invitations);
  };

  return (
    <div className="bg-slate-50 py-6">
      <div className="max-w-4xl mx-auto bg-gray-50 py-5 px-6 rounded-xl">
        <div className="pb-6 border-b border-slate-300">
          <div>
            <H3>Join the movement: Your Invitation Awaits!</H3>
          </div>
        </div>
        <Body1 className="mt-6">
          Welcome to the heart of political change! Here, you can view
          invitations from candidates who believe in your potential to make a
          difference. Your skills and enthusiasm are in high demand. Take a
          moment to review the invitations and decide how you&apos;d like to
          contribute to shaping the future.
        </Body1>
        {(!invitations || invitations.length === 0) && (
          <H3 className="mt-12">No invitations available at the moment.</H3>
        )}
        {invitations && invitations.length > 0 && (
          <div className="grid grid-cols-12 gap-4">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="col-span-12 md:col-span-6">
                <Invitation
                  invitation={invitation}
                  reloadInvitationsCallback={reloadInvitations}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
