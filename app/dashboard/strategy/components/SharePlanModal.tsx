'use client'

import { useState } from 'react'
import {
  Check,
  Copy,
  Facebook,
  Instagram,
  Link as LinkIcon,
  Mail,
  Twitter,
} from 'lucide-react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@styleguide'

interface SharePlanModalProps {
  open: boolean
  onClose: () => void
  url: string
  candidateName: string
}

const SharePlanModal = ({
  open,
  onClose,
  url,
  candidateName,
}: SharePlanModalProps): React.JSX.Element => {
  const [copied, setCopied] = useState(false)

  const subject = candidateName
    ? `${candidateName}'s campaign plan`
    : 'My campaign plan'
  const message = candidateName
    ? `${candidateName} just built a campaign plan with GoodParty.org. Take a look:`
    : 'I just built a campaign plan with GoodParty.org. Take a look:'

  const encodedUrl = encodeURIComponent(url)
  const encodedMessage = encodeURIComponent(message)

  const links: { label: string; icon: React.ReactNode; href: string }[] = [
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
      label: 'Instagram',
      icon: <Instagram className="size-5" />,
      href: 'https://www.instagram.com/',
    },
  ]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable; do nothing.
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your campaign plan</DialogTitle>
          <DialogDescription>
            Send your plan to a teammate, family member, or supporter.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            icon={
              copied ? (
                <Check className="size-5" />
              ) : (
                <Copy className="size-5" />
              )
            }
            onClick={handleCopy}
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
                asChild
              >
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  {item.icon}
                  {item.label}
                </a>
              </Button>
            ))}
          </div>
        </div>

        <p className="flex items-center gap-2 truncate rounded-md border border-base-border bg-muted px-3 py-2 text-xs text-muted-foreground">
          <LinkIcon className="size-3 shrink-0" aria-hidden="true" />
          <span className="truncate">{url}</span>
        </p>
      </DialogContent>
    </Dialog>
  )
}

export default SharePlanModal
