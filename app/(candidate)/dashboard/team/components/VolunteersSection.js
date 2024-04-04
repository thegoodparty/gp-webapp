import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import Paper from '@shared/utils/Paper';
import { formatToPhone } from 'helpers/numberHelper';
import { Fragment } from 'react';
import Volunteer from './Volunteer';
import InviteButton from './InviteButton';

export default function VolunteersSection(props) {
  const { volunteers, reloadInvitationsCallback, invitations } = props;
  if (!volunteers || volunteers.length === 0) {
    return null;
  }

  const hideButton = invitations && invitations.length > 0;
  return (
    <section className="mt-6">
      <Paper>
        <div className="flex justify-between items-center">
          <div>
            <H2 className="mb-2">Campaign Team</H2>

            <Body2>Manage all your team members in one place. </Body2>
          </div>
          {!hideButton && (
            <InviteButton
              reloadInvitationsCallback={reloadInvitationsCallback}
            />
          )}
        </div>

        <div className="grid grid-cols-12 gap-4 mt-8">
          {volunteers.map((volunteer) => (
            <Volunteer volunteer={volunteer} key={volunteer.id} />
          ))}
        </div>
      </Paper>
    </section>
  );
}
