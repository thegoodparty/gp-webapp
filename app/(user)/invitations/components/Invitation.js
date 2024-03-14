'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Body1 from '@shared/typography/Body1';
import H4 from '@shared/typography/H4';
import { calcLocation } from 'app/candidate/[slug]/components/ProfileSection';
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
  const { invitation, reloadInvitationsCallback } = props;
  const {
    firstName,
    lastName,
    office,
    otherOffice,
    district,
    state,

    occupation,
    city,
  } = invitation?.campaign || {};

  const resolvedOffice = office === 'Other' ? otherOffice : office;
  const loc = calcLocation({ office, state, district, city });

  const handleAccept = async () => {
    await acceptInvitation(invitation.id);
    await reloadInvitationsCallback();
  };
  return (
    <div className="my-6 bg-slate-100 px-3 py-2 rounded-lg">
      <H4>
        {firstName} {lastName}
      </H4>
      <Body1>
        Running for {resolvedOffice} in {loc}
      </Body1>
      <div className="mt-12" onClick={handleAccept}>
        <PrimaryButton fullWidth size="medium">
          Accept {invitation.role} invitation
        </PrimaryButton>
      </div>
    </div>
  );
}
