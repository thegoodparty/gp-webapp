'use client';
import { CampaignRequestButton } from 'app/(candidate)/dashboard/team/components/CampaignRequestButton';
import { PENDING_REQUEST_ACTIONS } from 'app/(candidate)/dashboard/team/components/PendingRequests';
import UserAvatar from '@shared/user/UserAvatar';
import { parsePhoneNumber } from 'libphonenumber-js';

const ROLE_LABELS = {
  manager: 'Campaign Manager',
  volunteer: 'Volunteer',
  staff: 'Staff',
};

export const PendingRequestCard = ({
  request,
  onAction = (action, request) => {},
}) => {
  const { user, role } = request;
  const { email, phone } = user;
  const name =
    user?.firstName || user.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : '';

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-6">
      <div className="py-6 px-4 border border-slate-300 rounded-lg flex justify-between">
        <div className="bg-primary rounded-xl h-fit p-4 mr-4">
          <UserAvatar
            className="!cursor-default text-white"
            user={user}
            size="small"
          />
        </div>
        <div className="block">
          {name && <div className="font-medium mb-1">{name}</div>}
          {role && (
            <div className="mb-1 text-sm capitalize">{ROLE_LABELS[role]}</div>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              target="_blank"
              className="underline text-blue-700 mb-1 block text-sm"
            >
              {email}
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              target="_blank"
              className="hover:underline mb-1 block text-sm"
            >
              {parsePhoneNumber(phone, 'US').formatNational()}
            </a>
          )}
        </div>
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
