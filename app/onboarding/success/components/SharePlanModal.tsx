'use client'

import { useState } from 'react'
import { Check, Copy, Facebook, Instagram, Mail, Twitter } from 'lucide-react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@styleguide'
import { useIsMobile } from '@styleguide/hooks/use-mobile'

interface SharePlanModalProps {
  open: boolean
  onClose: () => void
  url: string
  candidateName: string
}

interface ShareLink {
  label: string
  icon: React.ReactNode
  href: string
  // Optional override for the click action. Defaults to opening `href`
  // in a new tab; used by destinations like Instagram that have no
  // web-share endpoint and need a side effect (copy URL to clipboard)
  // before the user lands on the platform.
  onClick?: () => void
}

interface ShareBodyProps {
  copied: boolean
  onCopy: () => void
  links: ShareLink[]
}

const ShareBody = ({
  copied,
  onCopy,
  links,
}: ShareBodyProps): React.JSX.Element => (
  <div className="space-y-2">
    <Button
      type="button"
      variant="outline"
      className="w-full justify-start"
      icon={copied ? <Check className="size-5" /> : <Copy className="size-5" />}
      onClick={onCopy}
    >
      {copied ? 'Link copied' : 'Copy link'}
    </Button>
    <div className="grid grid-cols-2 gap-2">
      {links.map((item) => (
        <Button
          key={item.label}
          type="button"
          variant="outline"
          className="w-full justify-start"
          icon={item.icon}
          onClick={() => {
            if (item.onClick) {
              item.onClick()
              return
            }
            window.open(item.href, '_blank', 'noopener,noreferrer')
          }}
        >
          {item.label}
        </Button>
      ))}
    </div>
  </div>
)

const SharePlanModal = ({
  open,
  onClose,
  url,
  candidateName,
}: SharePlanModalProps): React.JSX.Element => {
  const isMobile = useIsMobile()
  const [copied, setCopied] = useState(false)

  const subject = candidateName
    ? `${candidateName}'s campaign plan`
    : 'My campaign plan'
  const message = candidateName
    ? `${candidateName} just built a campaign plan with GoodParty.org. Take a look:`
    : 'I just built a campaign plan with GoodParty.org. Take a look:'

  const encodedUrl = encodeURIComponent(url)
  const encodedMessage = encodeURIComponent(message)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable; do nothing.
    }
  }

  const links: ShareLink[] = [
    {
      label: 'Email',
      icon: <Mail className="size-5" />,
      href: `mailto:?subject=${encodeURIComponent(
        subject,
      )}&body=${encodedMessage}%0D%0A%0D%0A${encodedUrl}`,
    },
    {
      label: 'Facebook',
      icon: <Facebook className="size-5" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: 'X',
      icon: <Twitter className="size-5" />,
      href: `https://twitter.com/share?url=${encodedUrl}&text=${encodedMessage}`,
    },
    {
      // Instagram has no web-share endpoint, so we copy the plan URL to
      // the clipboard first (matching the Copy link button's behavior)
      // and then open instagram.com — the user can paste into DMs,
      // Stories, or a post caption. Without the copy step the button
      // is a silent dead end.
      //
      // Fire-and-forget the copy + call window.open synchronously inside
      // the click handler so the browser still treats it as a user
      // gesture and doesn't pop-up-block the new tab.
      label: 'Instagram',
      icon: <Instagram className="size-5" />,
      href: 'https://www.instagram.com/',
      onClick: () => {
        void handleCopy()
        window.open(
          'https://www.instagram.com/',
          '_blank',
          'noopener,noreferrer',
        )
      },
    },
  ]

  const title = 'Share your campaign plan'
  const description =
    'Send your plan to a teammate, family member, or supporter.'

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-4 p-4">
            <ShareBody copied={copied} onCopy={handleCopy} links={links} />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ShareBody copied={copied} onCopy={handleCopy} links={links} />
      </DialogContent>
    </Dialog>
  )
}

export default SharePlanModal
