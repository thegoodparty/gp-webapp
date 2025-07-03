'use client'

import { useEffect, useState } from 'react'
import { useMediaQuery } from '@mui/material'
import { CloseRounded } from '@mui/icons-material'
import MuiModal from '@mui/material/Modal'
import Paper from './Paper'
import H2 from '@shared/typography/H2'
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
          w-full md:w-auto md:min-w-[500px] md:max-w-[90vw] max-h-[80vh] 
          !px-4 !pt-16 !pb-8 md:!px-8 lg:!p-16
          !rounded-b-none md:!rounded-b-xl
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
