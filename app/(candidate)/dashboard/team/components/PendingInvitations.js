import Paper from '@shared/utils/Paper';
import InviteButton from './InviteButton';
import H2 from '@shared/typography/H2';
import { Fragment } from 'react';
import { FaTrash } from 'react-icons/fa';
import { dateUsHelper } from 'helpers/dateHelper';
import Invitation from './Invitation';

export default function PendingInvitations(props) {
  const { invitations, reloadInvitationsCallback } = props;
  return (
    <Paper>
      <div className="flex justify-between items-center">
        <H2>Pending Invitations</H2>
        <InviteButton reloadInvitationsCallback={reloadInvitationsCallback} />
      </div>
      <div className="grid grid-cols-12 gap-4 mt-12">
        {invitations.map((invitation) => (
          <Invitation
            key={invitation.id}
            invitation={invitation}
            reloadInvitationsCallback={reloadInvitationsCallback}
          />
        ))}
      </div>
    </Paper>
  );
}
