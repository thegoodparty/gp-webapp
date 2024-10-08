'use client';
import { useState } from 'react';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import TeamMembers from 'app/(candidate)/dashboard/team/components/TeamMembers';
import { PendingRequests } from 'app/(candidate)/dashboard/team/components/PendingRequests';

const fetchVolunteers = async () => {
  try {
    const api = gpApi.campaign.campaignVolunteer.list;

    return await gpFetch(api);
  } catch (e) {
    console.log('error at fetchVolunteers', e);
    return {};
  }
};

async function fetchInvitations() {
  try {
    const api = gpApi.campaign.volunteerInvitation.list;

    return await gpFetch(api);
  } catch (e) {
    console.log('error at fetchInvitations', e);
    return {};
  }
}

export default function TeamSection(props) {
  const {
    requests,
    volunteers: initVolunteers,
    invitations: initInvitations,
  } = props;
  const [volunteers, setVolunteers] = useState(initVolunteers || []);
  const [invitations, setInvitations] = useState(initInvitations || []);

  const reloadVolunteers = async () =>
    setVolunteers((await fetchVolunteers()).volunteers);

  const reloadInvitationsCallback = async () => {
    const res = await fetchInvitations();
    setInvitations(res.invitations);
  };

  return (
    <section className="">
      {Boolean(requests && requests.length) && (
        <PendingRequests requests={requests} onAction={reloadVolunteers} />
      )}

      <TeamMembers
        volunteers={volunteers}
        invitations={invitations}
        onAction={reloadVolunteers}
        reloadInvitations={reloadInvitationsCallback}
      />
    </section>
  );
}
