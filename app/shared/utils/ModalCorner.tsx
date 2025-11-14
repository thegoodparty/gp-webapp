'use client'

import * as React from 'react'
import MuiModal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { IoIosCloseCircle } from 'react-icons/io'
import { useMediaQuery } from '@mui/material'
import { ReactNode, CSSProperties } from 'react'

interface ModalCornerProps {
  open: boolean
  closeCallback: () => void
  children?: ReactNode
  boxStyle?: CSSProperties
  preventBackdropClose?: boolean
}

const ModalCorner = ({
  open,
  closeCallback,
  children,
  boxStyle = {},
  preventBackdropClose = false,
}: ModalCornerProps) => {
  const handleClose = (_e: unknown, reason?: string): void => {
    if (reason === 'backdropClick' && preventBackdropClose) {
      return
    }
    closeCallback()
  }

  const styleMobile = {
    position: 'absolute' as const,
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
    overflowY: 'auto' as const,
  }

  const styleDesktop = {
    position: 'absolute' as const,
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
    overflowY: 'auto' as const,
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

export default ModalCorner

