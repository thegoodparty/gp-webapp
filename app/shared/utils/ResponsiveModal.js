'use client'

import { useEffect, useState } from 'react'
import { useMediaQuery } from '@mui/material'
import { CloseRounded } from '@mui/icons-material'
import MuiModal from '@mui/material/Modal'
import Paper from './Paper'
import H5 from '@shared/typography/H5'

const SLIDE_DURATION = 200

/** A modal that becomes a bottom sheet on mobile sizes */
export default function ResponsiveModal({
  open,
  onClose,
  title,
  children,
  preventBackdropClose = false,
  preventEscClose = false,
  hideClose = false,
  fullSize = false,
}) {
  const [showContent, setShowContent] = useState(open)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  useEffect(() => {
    if (isDesktop && !fullSize) {
      setShowContent(open)
    } else {
      // on mobile sizes, this timeout allows for the modal CSS transition
      const timer = setTimeout(
        () => setShowContent(open),
        open ? 0 : SLIDE_DURATION,
      )
      return () => clearTimeout(timer)
    }
  }, [open, isDesktop, fullSize])

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
          ${showContent && open ? 'bottom-0' : '-bottom-[100%]'}
          ${
            fullSize
              ? 'w-[100vw] h-[100vh] max-w-[100vw] max-h-[100vh]'
              : 'lg:left-1/2 lg:-translate-x-1/2 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2 w-full lg:w-auto lg:min-w-[600px] lg:max-w-[90vw] max-h-[90vh]'
          } 
          !px-4 !pt-16 !pb-8 lg:!px-8 xl:!p-16
          !rounded-b-none lg:!rounded-b-xl
          transition-[bottom] duration-${SLIDE_DURATION} ease-out
          flex flex-col
        `}
      >
        {title && <H5 className="absolute top-6 left-4">{title}</H5>}
        {!hideClose && (
          <CloseRounded
            className="cursor-pointer absolute top-6 right-4"
            onClick={onClose}
            size={24}
          />
        )}

        <div className="flex-1 overflow-auto">{children}</div>
      </Paper>
    </MuiModal>
  )
}
