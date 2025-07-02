'use client'

import { useEffect, useState } from 'react'
import { useMediaQuery } from '@mui/material'
import { CloseRounded } from '@mui/icons-material'
import MuiModal from '@mui/material/Modal'
import Paper from './Paper'

const SLIDE_DURATION = 300

/** A modal that becomes a bottom sheet on mobile sizes */
export default function ResponsiveModal({
  open,
  onClose,
  children,
  preventBackdropClose = false,
  preventEscClose = false,
  hideClose = false,
}) {
  const [showContent, setShowContent] = useState(open)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  useEffect(() => {
    if (isDesktop) {
      setShowContent(open)
    } else {
      // on mobile sizes, this timeout allows for the modal CSS transition
      const timer = setTimeout(
        () => setShowContent(open),
        open ? 0 : SLIDE_DURATION,
      )
      return () => clearTimeout(timer)
    }
  }, [open, isDesktop])

  const handleClose = (e, reason) => {
    if (
      (reason === 'backdropClick' && preventBackdropClose) ||
      (reason === 'escapeKeyDown' && preventEscClose)
    ) {
      return
    }
    onClose?.()
  }

  return (
    <MuiModal open={open || showContent} onClose={handleClose}>
      <Paper
        className={`
          absolute 
          ${showContent && open ? 'bottom-0' : '-bottom-[100%]'} md:!bottom-auto
          md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2
          w-full md:w-auto md:min-w-72 md:max-w-[90vw] md:max-h-[90vh] 
          px-4 pt-16 pb-8 md:!p-16
          !rounded-b-none md:!rounded-b-xl
          transition-[bottom] duration-${SLIDE_DURATION} ease-out
        `}
      >
        {!hideClose && (
          <CloseRounded
            className="absolute top-6 right-6 cursor-pointer"
            onClick={onClose}
            size={24}
          />
        )}
        {children}
      </Paper>
    </MuiModal>
  )
}
