import AlertDialog from '@shared/utils/AlertDialog'

export const DemoAccountDeleteDialog = ({
  open,
  handleClose = () => {},
  handleProceed = () => {},
}) => (
  <AlertDialog
    open={open}
    handleClose={handleClose}
    title="Are you sure?"
    ariaLabel="Upgrade Account"
    description="Are you sure you want to upgrade your account? All demo campaign data will be lost."
    handleProceed={handleProceed}
  />
)
