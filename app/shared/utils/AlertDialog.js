'use client';
import React from 'react';
import Dialog from '@mui/material/Dialog';
import WarningIcon from '@mui/icons-material/Warning';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import BlackOutlinedButton from '@shared/buttons/BlackOutlinedButton';
import BlackOutlinedButtonClient from '@shared/buttons/BlackOutlinedButtonClient';

function AlertDialog({
  handleClose,
  handleProceed,
  open,
  title,
  description,
  ariaLabel,
}) {
  return (
    <Dialog onClose={handleClose} aria-labelledby={ariaLabel} open={open}>
      <div className="p-8">
        <div
          className="text-3xl flex items-center font-black"
          id="alert-dialog-title"
        >
          <WarningIcon /> &nbsp; {title}
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
          <BlackButtonClient onClick={handleProceed}>
            <div className="py-0 px-6 text-sm font-black">Proceed</div>
          </BlackButtonClient>
        </div>
      </div>
    </Dialog>
  );
}

export default AlertDialog;
