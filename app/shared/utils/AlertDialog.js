'use client';
import React from 'react';
import Dialog from '@mui/material/Dialog';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import BlackOutlinedButtonClient from '@shared/buttons/BlackOutlinedButtonClient';
import ErrorButton from '@shared/buttons/ErrorButton';
import H2 from '@shared/typography/H2';

function AlertDialog({
  handleClose,
  handleProceed,
  open,
  title,
  description,
  ariaLabel,
  redButton = true,
}) {
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby={title || ariaLabel}
      open={open}
      PaperProps={{ sx: { borderRadius: '20px' } }}
    >
      <div className="p-8">
        <div
          className="text-3xl flex items-center font-black"
          id="alert-dialog-title"
        >
          <H2 className="pb-5 mb-5 border-b border-slate-500 text-center w-full">
            {title}
          </H2>
        </div>
        <div className="text-lg my-8 mx-0" id="alert-dialog-description">
          {description}
        </div>
        <div className="flex items-center justify-center">
          <BlackOutlinedButtonClient
            className="outlined"
            onClick={handleClose}
            style={{ marginRight: '26px' }}
          >
            <div className="py-0 px-6 text-sm font-black">Cancel</div>
          </BlackOutlinedButtonClient>

          {redButton ? (
            <div onClick={handleProceed}>
              <ErrorButton>
                <div className="py-0 px-6 text-sm font-black ">Proceed</div>
              </ErrorButton>
            </div>
          ) : (
            <BlackButtonClient onClick={handleProceed}>
              <div className="py-0 px-6 text-sm font-black ">Proceed</div>
            </BlackButtonClient>
          )}
        </div>
      </div>
    </Dialog>
  );
}

export default AlertDialog;
