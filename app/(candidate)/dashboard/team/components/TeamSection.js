'use client';
import Paper from '@shared/utils/Paper';
import { useState } from 'react';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import EmptyState from './EmptyState';
import PendingInvitations from './PendingInvitations';
import VolunteersSection from './VolunteersSection';
import { PendingRequests } from 'app/(candidate)/dashboard/team/components/PendingRequests';

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
  const { requests } = props;
  const [volunteers, setVolunteers] = useState(props.volunteers || []);
  const [invitations, setInvitations] = useState(props.invitations || []);

  const reloadInvitationsCallback = async () => {
    const res = await fetchInvitations();
    setInvitations(res.invitations);
  };

  return (
    <section className="">
      {Boolean(
        !volunteers?.length && !invitations?.length && !requests?.length,
      ) && <EmptyState reloadInvitationsCallback={reloadInvitationsCallback} />}

      {Boolean(volunteers && volunteers.length) && (
        <VolunteersSection
          volunteers={volunteers}
          invitations={invitations}
          reloadInvitationsCallback={reloadInvitationsCallback}
        />
      )}

      {Boolean(invitations && invitations.length) && (
        <PendingInvitations
          reloadInvitationsCallback={reloadInvitationsCallback}
          invitations={invitations}
        />
      )}

      {Boolean(requests && requests.length) && (
        <PendingRequests requests={requests} />
      )}
    </section>
  );
}
