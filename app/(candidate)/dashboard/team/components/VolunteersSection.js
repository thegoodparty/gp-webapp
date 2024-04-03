import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import Paper from '@shared/utils/Paper';
import { formatToPhone } from 'helpers/numberHelper';
import { Fragment } from 'react';
import Volunteer from './Volunteer';
import InviteButton from './InviteButton';

export default function VolunteersSection(props) {
  const { volunteers, reloadInvitationsCallback } = props;
  if (!volunteers || volunteers.length === 0) {
    return null;
  }
  return (
    <section className="mt-6">
      <Paper>
        <div className="flex justify-between items-center">
          <div>
            <H2 className="mb-2">Campaign Team</H2>

            <Body2>Manage all your team members in one place. </Body2>
          </div>
          <InviteButton reloadInvitationsCallback={reloadInvitationsCallback} />
        </div>

        <div className="grid grid-cols-12 gap-4 mt-8">
          {volunteers.map((volunteer) => (
            <div
              className="col-span-6 md:col-span-6 lg:col-span-4"
              key={volunteer.id}
            >
              <Volunteer volunteer={volunteer} />
            </div>
          ))}
        </div>
      </Paper>
    </section>
  );
}
