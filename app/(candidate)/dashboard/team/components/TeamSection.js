'use client';
import Paper from '@shared/utils/Paper';
import { useState } from 'react';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import EmptyState from './EmptyState';
import PendingInvitations from './PendingInvitations';
import VolunteersSection from './VolunteersSection';

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
  const [volunteers, setVolunteers] = useState(props.volunteers || []);
  const [invitations, setInvitations] = useState(props.invitations || []);

  const reloadInvitationsCallback = async () => {
    const res = await fetchInvitations();
    setInvitations(res.invitations);
  };

  return (
    <section className="">
      {volunteers?.length === 0 && invitations?.length === 0 ? (
        <EmptyState reloadInvitationsCallback={reloadInvitationsCallback} />
      ) : null}

      {invitations && invitations.length > 0 ? (
        <PendingInvitations
          reloadInvitationsCallback={reloadInvitationsCallback}
          invitations={invitations}
        />
      ) : null}
      {volunteers && volunteers.length > 0 ? (
        <VolunteersSection
          volunteers={volunteers}
          invitations={invitations}
          reloadInvitationsCallback={reloadInvitationsCallback}
        />
      ) : null}
    </section>
  );
}
