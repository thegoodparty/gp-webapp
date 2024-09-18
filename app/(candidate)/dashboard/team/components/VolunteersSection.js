import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import Paper from '@shared/utils/Paper';
import Volunteer from './Volunteer';
import InviteButton from './InviteButton';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';

const deleteCampaignVolunteer = async (
  volunteerId,
  onSuccess = () => {},
  onError = () => {},
) => {
  try {
    const { url, ...apiProperties } = gpApi.campaign.campaignVolunteer.delete;
    const result = await gpFetch({
      url: url.replace(':id', volunteerId),
      ...apiProperties,
    });
    if (!result || result.ok === false) {
      console.error('error at deleteCampaignVolunteer', result);
      onError();
    } else {
      onSuccess();
    }
  } catch (e) {
    console.error('error at deleteCampaignVolunteer', e);
  }
};

export default function VolunteersSection(props) {
  const { volunteers, onAction, invitations } = props;
  const snackbarState = useHookstate(globalSnackbarState);

  const handleRemove = async (volunteerId) => {
    await deleteCampaignVolunteer(volunteerId, onAction, () =>
      snackbarState.set(() => ({
        isOpen: true,
        isError: true,
        message: 'Error removing volunteer',
      })),
    );
  };

  if (!volunteers || volunteers.length === 0) {
    return null;
  }

  const hideButton = invitations && invitations.length > 0;
  return (
    <Paper className="mb-4">
      <div className="flex justify-between items-center">
        <div>
          <H2 className="mb-2">Campaign Team</H2>

          <Body2>Manage all your team members in one place. </Body2>
        </div>
        {!hideButton && (
          <InviteButton reloadInvitationsCallback={reloadInvitationsCallback} />
        )}
      </div>

      <div className="grid grid-cols-12 gap-4 mt-8">
        {volunteers.map((volunteer) => (
          <Volunteer
            onRemove={handleRemove}
            volunteer={volunteer}
            key={volunteer.id}
          />
        ))}
      </div>
    </Paper>
  );
}
