import { useState } from 'react';
import Button from '@shared/buttons/Button';
import { sendSetPasswordEmail } from './AddUserButton';
import AlertDialog from '@shared/utils/AlertDialog';
import { USER_ROLES, userHasRole } from 'helpers/userHelper';

export default function ResendPasswordEmailAction({ user }) {
  const { id: userId, email, firstName, lastName } = user;
  const [dialogOpen, setDialogOpen] = useState(false);

  // only for sales role users now
  if (!userHasRole(user, USER_ROLES.SALES)) return <></>;

  function handleClick() {
    setDialogOpen(true);
  }

  function handleProceed() {
    sendSetPasswordEmail(userId);
    setDialogOpen(false);
  }

  return (
    <>
      <div className="my-3">
        <Button
          onClick={handleClick}
          size="small"
          className="w-full"
          color="info"
        >
          <span className="whitespace-nowrap">Resend Password Email</span>
        </Button>
      </div>
      <AlertDialog
        open={dialogOpen}
        handleClose={() => {
          setDialogOpen(false);
        }}
        redButton={false}
        title="Resend Set Password Email"
        description={`This will send a new set password email to ${firstName} ${lastName} at ${email}`}
        handleProceed={handleProceed}
      />
    </>
  );
}
