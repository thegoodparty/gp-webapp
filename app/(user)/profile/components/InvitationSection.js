'use client';

import H4 from '@shared/typography/H4';
import Body2 from '@shared/typography/Body2';
import { LuHeartHandshake } from 'react-icons/lu';
import Invitation from './Invitation';
import { setCookie } from 'helpers/cookieHelper';

function InvitationSection(props) {
  const { invitations } = props;
  if (!invitations || invitations.length === 0) {
    return null;
  }
  const acceptInvitations = async (slug) => {
    setCookie('volunteer', slug);
    window.location.href = '/volunteer-dashboard';
  };
  return (
    <section className="py-4 border-b border-slate-300">
      <div className="flex">
        <div className="shrink-0 pr-3 text-indigo-50 pt-[6px]">
          <LuHeartHandshake />
        </div>
        <div className="flex-1">
          <H4>Invitations</H4>
          <Body2 className="text-indigo-200">
            Join the movement: Your Invitation Awaits!
          </Body2>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 mt-8">
        {invitations.map((invitation) => (
          <div key={invitation.id} className="col-span-12 md:col-span-6">
            <Invitation
              invitation={invitation}
              acceptInvitationsCallback={acceptInvitations}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default InvitationSection;
