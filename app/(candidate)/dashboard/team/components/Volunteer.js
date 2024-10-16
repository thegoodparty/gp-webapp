'use client';
import { CampaignTeamMemberInfo } from 'app/(candidate)/dashboard/team/components/CampaignTeamMemberInfo';
import { MoreMenu } from '@shared/utils/MoreMenu';
import AlertDialog from '@shared/utils/AlertDialog';
import { useState } from 'react';
import { getUserFullName } from '@shared/utils/getUserFullName';
import Body2 from '@shared/typography/Body2';

export default function Volunteer(props) {
  const { volunteer, onRemove = (volunteerId) => {} } = props;
  const { role, user } = volunteer;
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const handleRemove = () => setShowRemoveDialog(true);

  return (
    <div className="col-span-12 md:col-span-12 lg:col-span-6 h-full">
      <div className="p-2 md:p-6 border border-slate-300 rounded-lg flex justify-between  h-full">
        <CampaignTeamMemberInfo user={user} role={role} />
        <div className="flex justify-center relative">
          <MoreMenu
            {...{
              menuItems: [
                {
                  label: 'Remove',
                  onClick: handleRemove,
                },
              ],
            }}
          />
        </div>
      </div>
      <AlertDialog
        open={showRemoveDialog}
        handleClose={() => {
          setShowRemoveDialog(false);
        }}
        handleProceed={() => {
          setShowRemoveDialog(false);
          onRemove(volunteer.id);
        }}
        {...{
          title: `Are you sure you want to remove ${getUserFullName(
            user,
          )} from your campaign?`,
          description: (
            <>
              <Body2 className="mb-4">
                Removing a member from your campaign will permanently erase
                their ability to login to your campaign or see any campaign
                related data.
              </Body2>
              <Body2>You can always re-invite members.</Body2>
            </>
          ),
          proceedLabel: 'Remove',
        }}
      />
    </div>
  );
}
