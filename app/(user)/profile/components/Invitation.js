'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Body1 from '@shared/typography/Body1';
import H4 from '@shared/typography/H4';
import { calcLocation } from 'app/(landing)/election-results/[...params]/components/ElectionCandidate';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

async function acceptInvitation(id) {
  try {
    const api = gpApi.campaign.campaignVolunteer.create;

    const payload = {
      id,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at acceptInvitation', e);
    return {};
  }
}

export default function Invitation(props) {
  const { invitation, acceptInvitationsCallback } = props;
  const { firstName, lastName, office, otherOffice, district, state, city } =
    invitation?.campaign || {};

  const resolvedOffice = office === 'Other' ? otherOffice : office;
  const loc = calcLocation({ office, state, district, city });

  const handleAccept = async () => {
    await acceptInvitation(invitation.id);
    await acceptInvitationsCallback(invitation.slug);
  };
  return (
    <div className="my-6 border border-slate-300 px-3 py-4 rounded-lg">
      <H4>
        {firstName} {lastName}
      </H4>
      <Body1>
        Running for {resolvedOffice} in {loc}
      </Body1>
      <div className="mt-12">
        <PrimaryButton fullWidth size="medium" onClick={handleAccept}>
          Accept {invitation.role} invitation
        </PrimaryButton>
      </div>
    </div>
  );
}
