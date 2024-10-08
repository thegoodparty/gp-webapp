import Actions from './Actions';
import { CampaignTeamMemberInfo } from 'app/(candidate)/dashboard/team/components/CampaignTeamMemberInfo';
import Chip from '@shared/utils/Chip';

export default function Invitation(props) {
  const { invitation } = props;
  return (
    <div
      className="col-span-12 md:col-span-12 lg:col-span-6"
      key={invitation.id}
    >
      <div className="py-6 px-4 border border-slate-300 rounded-lg flex justify-between">
        <CampaignTeamMemberInfo user={invitation} role={invitation.role} />
        <div className="flex h-fit items-center">
          <Chip className="bg-lime-300 uppercase mr-1">Invited</Chip>
          <Actions {...props} />
        </div>
      </div>
    </div>
  );
}
