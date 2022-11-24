'use client';
import React from 'react';
import Dialog from '@mui/material/Dialog';
import WarningIcon from '@mui/icons-material/Warning';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';

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
        <div className="text-3xl flex items-center font-black" id="alert-dialog-title">
          <WarningIcon /> &nbsp; {title}
        </div>
        <div 
            className="text-lg my-8 mx-0" id="alert-dialog-description"
        >
            {description}
        </div>
        <div className="flex-center">
          <BlackButtonClient
            className="outlined"
            onClick={handleClose}
            color="primary"
            style={{ marginRight: '26px' }}
          >
            <div className="py-0 px-6 text-xs font-black">
              Cancel
            </div>
          </BlackButtonClient>
          <BlackButtonClient onClick={handleProceed} color="primary" autoFocus>
            <div className="py-0 px-6 text-xs font-black">
              Proceed
            </div>
          </BlackButtonClient>
        </div>
      </div>
    </Dialog>
  );
}

export default AlertDialog;
