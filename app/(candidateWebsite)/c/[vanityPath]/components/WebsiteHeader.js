'use client'

import Image from 'next/image'
import { WEBSITE_STATUS } from 'app/(candidate)/dashboard/website/util/website.util'
import { getUserFullName } from '@shared/utils/getUserFullName'

export default function WebsiteHeader({ activeTheme, website }) {
  const homePath = `/c/${website.vanityPath}${
    website.status === WEBSITE_STATUS.unpublished ? '/preview' : ''
  }`
  const content = website.content || {}
  const candidate = website.campaign?.user
  return (
    <header className={`p-4 border-b ${activeTheme.border} ${activeTheme.bg}`}>
      <nav className="px-8 flex justify-between items-center">
        <a href={homePath} className="flex-1 min-w-0">
          {content.logo ? (
            <Image
              src={content.logo}
              alt="Campaign Logo"
              height={80}
              width={200}
              className="h-8 max-w-[200px] object-contain object-left"
            />
          ) : candidate ? (
            <h1 className={`text-2xl font-bold truncate`}>
              {getUserFullName(candidate)}
            </h1>
          ) : (
            <Image
              src={'/images/logo/heart.svg'}
              alt="Campaign Logo"
              height={80}
              width={200}
              className="h-8 max-w-[200px] object-contain object-left"
            />
          )}
        </a>
        <ul className="flex space-x-6 list-none">
          <li>
            <a href="#about" className="hover:opacity-80">
              About
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:opacity-80">
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
