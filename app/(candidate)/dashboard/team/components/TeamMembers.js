import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import Paper from '@shared/utils/Paper';
import Volunteer from './Volunteer';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import Invitation from 'app/(candidate)/dashboard/team/components/Invitation';
import H3 from '@shared/typography/H3';
import SadFaceAnimation from '@shared/animations/SadFaceAnimation';

const deleteCampaignVolunteer = async (
  volunteerId,
  onSuccess = () => {},
  onError = () => {},
) => {
  try {
    const result = await gpFetch(gpApi.campaign.campaignVolunteer.delete, {
      id: volunteerId,
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

const EmptyTeam = () => (
  <section className="text-center border rounded-xl p-6">
    <div className="max-w-[60px] m-auto">
      <SadFaceAnimation />
    </div>
    <H3 className="">You do not have any team members yet.</H3>
  </section>
);

export default function TeamMembers({
  volunteers = [],
  onAction,
  invitations = [],
  reloadInvitations,
}) {
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

  const aggregatedTeamMembers = [
    ...volunteers.map((volunteer) => (
      <Volunteer
        onRemove={handleRemove}
        volunteer={volunteer}
        key={volunteer.id}
      />
    )),
    ...invitations.map((invitation) => (
      <Invitation
        key={invitation.id}
        invitation={invitation}
        reloadInvitationsCallback={reloadInvitations}
      />
    )),
  ];

  return (
    <Paper className="mb-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <H2 className="mb-2">Campaign Team</H2>
          <Body2 className="text-gray-600">
            Manage all your team members in one place.{' '}
          </Body2>
        </div>
      </div>

      {!aggregatedTeamMembers.length ? (
        <EmptyTeam />
      ) : (
        <div className="grid grid-cols-12 gap-4">{aggregatedTeamMembers}</div>
      )}
    </Paper>
  );
}
