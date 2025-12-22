'use client'
import { Fragment, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { IoIosText } from 'react-icons/io'
import { FaFacebookF, FaTwitter } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { AiOutlineLink } from 'react-icons/ai'
import Overline from '@shared/typography/Overline'

interface ShareChannel {
  label: string
  icon: React.ReactNode
  link: string
}

interface ShareBlogProps {
  className?: string
}

export default function ShareBlog({
  className,
}: ShareBlogProps): React.JSX.Element {
  const pathname = usePathname()
  const [appBase, setAppBase] = useState('')
  const url = appBase + pathname
  const messageNoUrl = 'Vote different'
  const encodedUrl = encodeURIComponent(url)

  useEffect(() => setAppBase(window?.location.origin), [])

  const textMessageBody = `${url} ${'\n %0a'} ${'\n %0a'}${messageNoUrl}`

  const emailSubject = 'Check this out'
  const emailBody = `${messageNoUrl}%0D%0A%0D%0A${encodedUrl}%0D%0A%0D%0A GoodParty.org%0D%0AFree software for free elections`

  let hash = '#GoodParty'
  const hashQueryTwitter = hash ? `&hashtags=${hash}` : ''
  const hashQueryFacebook = hash ? `&hashtag=${hash}` : ''

  const channels: ShareChannel[] = [
    {
      label: 'Facebook',
      icon: <FaFacebookF className="text-xl" />,
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}${hashQueryFacebook}`,
    },
    {
      label: 'Email',
      icon: <MdEmail className="text-xl" />,
      link: `mailto:?body=${emailBody}&subject=${emailSubject}`,
    },
    {
      label: 'Link',
      icon: <AiOutlineLink className="text-xl" />,
      link: `${url}`,
    },
    {
      label: 'Text message',
      icon: <IoIosText className="text-xl" />,
      link: `sms:?&body=${textMessageBody.replace('&', '%26')}`,
    },
    {
      label: 'X',
      icon: <FaTwitter className="text-xl" />,
      link: `https://twitter.com/share?url=${encodedUrl}&text=${messageNoUrl}${hashQueryTwitter}`,
    },
  ]

  return (
    <div className={`mb-8 ${className}`} data-testid="shareBlog">
      <Overline className="mb-4">Share on</Overline>
      {channels.map((channel) => (
        <Fragment key={channel.label}>
          {channel.link && (
            <a
              className="w-8 h-8 mr-4 rounded-full bg-blue-500 text-white inline-flex justify-center items-center outline-offset-0 focus-visible:outline-primary-dark/40"
              href={channel.link}
              target="_blank"
              rel="noopener noreferrer nofollow"
              id={`${channel.label}-share`}
            >
              {channel.icon}
            </a>
          )}
        </Fragment>
      ))}
    </div>
  )
}
