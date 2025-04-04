'use client'

import * as React from 'react'
import MuiModal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { IoIosCloseCircle } from 'react-icons/io'
import { useMediaQuery } from '@mui/material'

export default function ModalCorner({
  open,
  closeCallback,
  children,
  boxStyle = {},
  preventBackdropClose = false,
}) {
  const handleClose = (e, reason) => {
    if (reason === 'backdropClick' && preventBackdropClose) {
      return
    }
    closeCallback()
  }

  const styleMobile = {
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
  }

  let styleDesktop = {
    position: 'absolute',
    bottom: '0',
    right: '0',
    minWidth: 280,
    maxWidth: 380,
    bgcolor: 'white',
    boxShadow: 8,
    p: 4,
    borderRadius: 2,
    outline: 'none',
    maxHeight: '90vh',
    overflowY: 'auto',
  }

  const desktopMode = useMediaQuery('(min-width: 768px)')
  return (
    <MuiModal open={open} onClose={handleClose}>
      <div className="bg-blue-400">
        <Box sx={desktopMode ? styleDesktop : styleMobile} style={boxStyle}>
          <div
            className="absolute top-4 right-4 cursor-pointer w-7 h-7 flex items-center justify-center"
            onClick={closeCallback}
          >
            <IoIosCloseCircle size={24} />
          </div>
          {children}
        </Box>
      </div>
    </MuiModal>
  )
}
