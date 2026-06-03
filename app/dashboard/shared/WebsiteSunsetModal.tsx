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

// Set to the real HubSpot domain-transfer form URL once the form is built in
// HubSpot (ENG-10295). While empty, WEBSITE_SUNSET_NOTICE_ENABLED is false and
// the notice is never shown (see DashboardContent). This avoids both linking to
// a non-existent form and opting users out of the notice before the form they
// need exists. The URL is opened in a new tab from the CTA.
const HUBSPOT_DOMAIN_TRANSFER_FORM_URL = ''

export const WEBSITE_SUNSET_NOTICE_ENABLED =
  HUBSPOT_DOMAIN_TRANSFER_FORM_URL.length > 0

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="gap-1.5">
          <DialogTitle>Website is being discontinued</DialogTitle>
          <DialogDescription>
            Your site will remain live for one year from your original purchase
            date, and you can still update your website content anytime under My
            Profile. To fully own and manage your domain, click Transfer
            Website.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() =>
              window.open(
                HUBSPOT_DOMAIN_TRANSFER_FORM_URL,
                '_blank',
                'noopener,noreferrer',
              )
            }
          >
            Transfer website
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
