'use client'

import { Download } from 'lucide-react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@styleguide'
import { useIsMobile } from '@styleguide/hooks/use-mobile'

interface DownloadReminderModalProps {
  open: boolean
  onClose: () => void
  // Whether the plan has finished generating. While false the download
  // action is disabled with the same "preparing" treatment as the bottom bar.
  planReady: boolean
  downloading: boolean
  // Triggers the download. The parent closes the modal once it resolves.
  onDownloadNow: () => void
  // Leaves the page for Campaign Manager regardless of download state.
  onContinue: () => void
}

const TITLE = 'Download your campaign plan?'
const DESCRIPTION =
  "You haven't downloaded your campaign plan yet. Download a copy now, or continue to your Campaign manager."
const PREPARING_TOOLTIP =
  'Your plan is still being generated. It will be ready in a moment.'

const DownloadReminderModal = ({
  open,
  onClose,
  planReady,
  downloading,
  onDownloadNow,
  onContinue,
}: DownloadReminderModalProps): React.JSX.Element => {
  const isMobile = useIsMobile()

  const downloadButton = (
    <Button
      type="button"
      variant="default"
      icon={<Download className="size-5" />}
      loading={downloading || !planReady}
      loadingText={!planReady && !downloading ? 'Preparing plan…' : undefined}
      onClick={onDownloadNow}
      className="w-full"
    >
      Download now
    </Button>
  )

  // A disabled button suppresses its own pointer events, so the tooltip
  // trigger has to wrap it (the span receives the hover instead).
  const downloadAction = planReady ? (
    downloadButton
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex w-full">{downloadButton}</span>
      </TooltipTrigger>
      <TooltipContent>{PREPARING_TOOLTIP}</TooltipContent>
    </Tooltip>
  )

  const continueButton = (
    <Button
      type="button"
      variant="outline"
      onClick={onContinue}
      className="w-full"
    >
      Continue to Campaign manager
    </Button>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{TITLE}</DrawerTitle>
            <DrawerDescription>{DESCRIPTION}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            {downloadAction}
            {continueButton}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{TITLE}</DialogTitle>
          <DialogDescription>{DESCRIPTION}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {downloadAction}
          {continueButton}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DownloadReminderModal
