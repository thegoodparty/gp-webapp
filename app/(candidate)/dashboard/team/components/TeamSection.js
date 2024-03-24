'use client';
import Paper from '@shared/utils/Paper';
import Image from 'next/image';
import { useState } from 'react';
import waveImg from 'public/images/dashboard/wave.png';
import H3 from '@shared/typography/H3';
import Body1 from '@shared/typography/Body1';
import InviteButton from './InviteButton';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import EmptyState from './EmptyState';
import PendingInvitations from './PendingInvitations';

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
    const { invitations } = await fetchInvitations();
    setInvitations(invitations);
  };

  return (
    <section className="">
      {volunteers?.length === 0 && invitations?.length === 0 ? (
        <EmptyState reloadInvitationsCallback={reloadInvitationsCallback} />
      ) : null}

      {invitations && invitations.length > 0 ? (
        <PendingInvitations
          reloadInvitationsCallback={reloadInvitationsCallback}
          {...props}
        />
      ) : null}
      {volunteers && volunteers.length > 0 ? <Paper>volunteers</Paper> : null}
    </section>
  );
}
