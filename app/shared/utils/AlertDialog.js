'use client';
import React from 'react';
import Dialog from '@mui/material/Dialog';
import ErrorButton from '@shared/buttons/ErrorButton';
import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import PrimaryButton from '@shared/buttons/PrimaryButton';

function AlertDialog({
  handleClose,
  handleProceed,
  open,
  title,
  description,
  ariaLabel,
  redButton = true,
  cancelLabel = 'Cancel',
  proceedLabel = 'Proceed',
  onCancel,
}) {
  const handleCancel = () => {
    if (onCancel && typeof onCancel === 'function') {
      return onCancel();
    }
    handleClose();
  };
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby={title || ariaLabel}
      open={open}
      PaperProps={{ sx: { borderRadius: '20px' } }}
    >
      <div className="p-16">
        <div
          className="text-3xl flex items-center font-black"
          id="alert-dialog-title"
        >
          <H1 className="mb-4 text-center w-full">{title}</H1>
        </div>
        <Body2 className="mx-0 mb-8 text-center" id="alert-dialog-description">
          {description}
        </Body2>
        <div className="flex items-center justify-center">
          <SecondaryButton
            className="mr-4"
            size="medium"
            onClick={handleCancel}
          >
            {cancelLabel}
          </SecondaryButton>

          {redButton ? (
            <div onClick={handleProceed}>
              <ErrorButton>
                <div className="py-0 px-6 text-sm font-black ">
                  {proceedLabel}
                </div>
              </ErrorButton>
            </div>
          ) : (
            <PrimaryButton size="medium" onClick={handleProceed}>
              {proceedLabel}
            </PrimaryButton>
          )}
        </div>
      </div>
    </Dialog>
  );
}

export default AlertDialog;
