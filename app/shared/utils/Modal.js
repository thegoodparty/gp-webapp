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

export default function Modal({ open, closeCallback, children }) {
  return (
    <MuiModal open={open} onClose={closeCallback} maxWidth="lg">
      <Box sx={style}>
        <div
          className="absolute top-4 right-4 cursor-pointer w-7 h-7 flex items-center justify-center"
          onClick={closeCallback}
        >
          <IoIosCloseCircle size={24} />
        </div>
        {children}
      </Box>
    </MuiModal>
  );
}
