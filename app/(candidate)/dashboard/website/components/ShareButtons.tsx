import CopyToClipboardButton from '@shared/utils/CopyToClipboardButton'
import { LuMail } from 'react-icons/lu'
import {
  InstagramLogo,
  FacebookLogo,
  TwitterLogo,
  NextdoorLogo,
} from '@shared/brand-logos'
import Button from '@shared/buttons/Button'

interface ShareLink {
  label: string
  icon: React.ReactNode
  href: string
}

interface ShareButtonsProps {
  url: string
  className?: string
}

export default function ShareButtons({ url, className = '' }: ShareButtonsProps): React.JSX.Element {
  const encodedUrl = encodeURIComponent(url)
  const message = 'Check out my campaign website!'
  const emailSubject = 'Check out my campaign website!'
  const emailBody = `${message}%0D%0A%0D%0A${encodedUrl}`

  const shareLinks: ShareLink[] = [
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
        className="w-full !border-[1px] !border-black/[0.12]"
      >
        Copy link
      </CopyToClipboardButton>
      {shareLinks.map((item) => (
        <Button
          key={item.label}
          variant="outlined"
          className="flex items-center gap-2 w-full !border-[1px] !border-black/[0.12]"
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
