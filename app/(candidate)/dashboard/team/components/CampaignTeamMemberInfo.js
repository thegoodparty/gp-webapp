import UserAvatar from '@shared/user/UserAvatar';
import { parsePhoneNumber } from 'libphonenumber-js';
import { ROLE_LABELS } from 'app/(candidate)/dashboard/team/components/PendingRequestCard';
import { getUserFullName } from '@shared/utils/getUserFullName';

export const CampaignTeamMemberInfo = ({ user, role }) => {
  const fullName = getUserFullName(user);
  const { email, phone } = user;
  return (
    <div className="flex justify-between">
      <div className="bg-primary rounded-xl h-fit p-4 mr-4">
        <UserAvatar
          className="!cursor-default text-white"
          user={user}
          size="small"
        />
      </div>
      <div className="block">
        {fullName && <div className="font-medium mb-1">{fullName}</div>}
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
    </div>
  );
};
