'use client';
import { CampaignRequestButton } from 'app/(candidate)/dashboard/team/components/CampaignRequestButton';
import { PENDING_REQUEST_ACTIONS } from 'app/(candidate)/dashboard/team/components/PendingRequests';
import { CampaignTeamMemberInfo } from 'app/(candidate)/dashboard/team/components/CampaignTeamMemberInfo';
import { getUserFullName } from '@shared/utils/getUserFullName';

export const ROLE_LABELS = {
  manager: 'Campaign Manager',
  volunteer: 'Volunteer',
  staff: 'Staff',
};

export const PendingRequestCard = ({
  request,
  onAction = (action, request) => {},
}) => {
  const { user, role } = request;
  const name = getUserFullName(user);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-6">
      <div className="py-6 px-4 border border-slate-300 rounded-lg flex justify-between">
        <CampaignTeamMemberInfo user={user} role={role} />
        <div className="flex h-fit">
          <CampaignRequestButton
            className="mr-4"
            onProceed={() => onAction(PENDING_REQUEST_ACTIONS.DELETE, request)}
            color="primary"
            variant="outlined"
            dialogOptions={{
              title: 'Deny Request',
              description: `Are you sure you want to deny ${name}'s request to join as ${ROLE_LABELS[role]}?`,
              proceedLabel: 'Deny',
            }}
          >
            Deny
          </CampaignRequestButton>
          <CampaignRequestButton
            color="primary"
            onProceed={() => onAction(PENDING_REQUEST_ACTIONS.GRANT, request)}
            dialogOptions={{
              title: 'Accept Request',
              description: `Are you sure you want to accept ${name}'s request to join as ${role}?`,
              proceedLabel: 'Accept',
            }}
          >
            Accept
          </CampaignRequestButton>
        </div>
      </div>
    </div>
  );
};
