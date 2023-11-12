'use client';

import * as React from 'react';
import MuiModal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { IoIosCloseCircle } from 'react-icons/io';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 280,
  bgcolor: 'white',
  boxShadow: 8,
  p: 4,
  borderRadius: 2,
  outline: 'none',
  maxHeight: '90vh',
  overflowY: 'auto',
};

export default function Modal({
  open,
  closeCallback,
  children,
  boxStyle = {},
  preventBackdropClose = false,
}) {
  const handleClose = (e, reason) => {
    if (reason === 'backdropClick' && preventBackdropClose) {
      return;
    }
    closeCallback();
  };
  return (
    <MuiModal open={open} onClose={handleClose}>
      <div className="bg-blue-400">
        <Box sx={style} style={boxStyle}>
          <div
            className="absolute top-4 right-4 cursor-pointer w-7 h-7 flex items-center justify-center modal-close"
            onClick={closeCallback}
          >
            <IoIosCloseCircle size={24} />
          </div>
          {children}
        </Box>
      </div>
    </MuiModal>
  );
}
