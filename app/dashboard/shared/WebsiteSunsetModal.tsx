'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@styleguide/components/ui/dialog'
import { Button } from '@styleguide/components/ui/button'
import { HUBSPOT_DOMAIN_TRANSFER_FORM_URL } from './websiteSunset'

interface WebsiteSunsetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WebsiteSunsetModal({
  open,
  onOpenChange,
}: WebsiteSunsetModalProps): React.JSX.Element {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="gap-1.5">
          <DialogTitle>
            Our build your own website feature is being discontinued
          </DialogTitle>
          <DialogDescription>
            Your site will remain live for one year from your original purchase
            date, and you can still update your website content anytime under My
            Profile. To fully own and manage your domain, click Transfer
            Website.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => {
              window.open(
                HUBSPOT_DOMAIN_TRANSFER_FORM_URL,
                '_blank',
                'noopener,noreferrer',
              )
              onOpenChange(false)
            }}
          >
            Transfer website
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
