import ResponsiveModal from '@shared/utils/ResponsiveModal'
import H1 from '@shared/typography/H1'
import CopyToClipboardButton from '@shared/utils/CopyToClipboardButton'
import { LuMail } from 'react-icons/lu'
import {
  InstagramLogo,
  FacebookLogo,
  TwitterLogo,
  NextdoorLogo,
} from '@shared/brand-logos'
import Button from '@shared/buttons/Button'
import Link from 'next/link'

export default function ShareModal({ open, onClose, url }) {
  const encodedUrl = encodeURIComponent(url)
  const message = 'Check out my campaign website!'
  const emailSubject = 'Check out my campaign website!'
  const emailBody = `${message}%0D%0A%0D%0A${encodedUrl}`

  const shareLinks = [
    {
      label: 'Email',
      icon: <LuMail />,
      href: `mailto:?body=${emailBody}&subject=${emailSubject}`,
    },
    {
      label: 'Instagram',
      icon: <InstagramLogo />,
      href: `https://www.instagram.com/`, // Instagram does not support direct sharing via URL
    },
    {
      label: 'Facebook',
      icon: <FacebookLogo />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: 'X',
      icon: <TwitterLogo />,
      href: `https://twitter.com/share?url=${encodedUrl}&text=${message}`,
    },
    {
      label: 'Nextdoor',
      icon: <NextdoorLogo />,
      href: `https://nextdoor.com/`, // Nextdoor does not support direct sharing via URL
    },
  ]

  return (
    <ResponsiveModal open={open} onClose={onClose}>
      <div className="text-center w-auto md:w-[600px]">
        <H1 className="mb-4">Share your campaign website</H1>
        <Link href={url} className="text-gray-500 text-sm" target="_blank">
          {url}
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:gap-x-8 mt-8">
        <CopyToClipboardButton
          copyText={url}
          variant="outlined"
          className="w-full"
        >
          Copy link
        </CopyToClipboardButton>
        {shareLinks.map((item) => (
          <Button
            key={item.label}
            variant="outlined"
            className="flex items-center gap-2"
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </div>
    </ResponsiveModal>
  )
}
