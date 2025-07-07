import CopyToClipboardButton from '@shared/utils/CopyToClipboardButton'
import { LuMail } from 'react-icons/lu'
import {
  InstagramLogo,
  FacebookLogo,
  TwitterLogo,
  NextdoorLogo,
} from '@shared/brand-logos'
import Button from '@shared/buttons/Button'

export default function ShareButtons({ url, className = '' }) {
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
      href: `https://www.instagram.com/`,
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
      href: `https://nextdoor.com/`,
    },
  ]

  return (
    <div className={`grid grid-cols-2 gap-4 md:gap-x-8 ${className}`}>
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
          className="flex items-center gap-2 w-full"
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
    </div>
  )
}
