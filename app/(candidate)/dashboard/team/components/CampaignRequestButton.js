import { useState } from 'react';
import Button from '@shared/buttons/Button';
import AlertDialog from '@shared/utils/AlertDialog';

export const CampaignRequestButton = ({
  children,
  onProceed = () => {},
  dialogOptions = {
    title: '',
    description: '',
  },
  ...restButtonProps
}) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button
        className="h-fit relative self-start"
        size="medium"
        onClick={() => setShowDialog(true)}
        {...restButtonProps}
      >
        {children}
      </Button>
      <AlertDialog
        open={showDialog}
        handleClose={() => {
          setShowDialog(false);
        }}
        handleProceed={() => {
          setShowDialog(false);
          onProceed();
        }}
        {...dialogOptions}
      />
    </>
  );
};
