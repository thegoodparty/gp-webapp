'use client'
import { usePublicCandidate } from './PublicCandidateProvider'
import Paper from '@shared/utils/Paper'
import H3 from '@shared/typography/H3'
import { getWebsiteUrl } from 'app/(candidate)/dashboard/website/util/website.util'
import {
  LuFacebook,
  LuGlobe,
  LuInstagram,
  LuLinkedin,
  LuMail,
  LuTwitter,
} from 'react-icons/lu'
import { PiTiktokLogoLight } from 'react-icons/pi'

import { Domain } from 'helpers/types'

interface Website {
  vanityPath?: string
  domain?: Domain | null
}

interface LinkItem {
  url: string
  icon: React.JSX.Element
  text: string
}

const mapSocialIcon = (url: string): React.JSX.Element => {
  if (url.includes('twitter') || url.includes('/x.com')) {
    return <LuTwitter size={20} />
  }
  if (url.includes('facebook')) {
    return <LuFacebook size={20} />
  }
  if (url.includes('instagram')) {
    return <LuInstagram size={20} />
  }
  if (url.includes('tiktok')) {
    return <PiTiktokLogoLight size={20} />
  }
  if (url.includes('linkedin')) {
    return <LuLinkedin size={20} />
  }
  if (url.includes('website')) {
    return <LuGlobe size={20} />
  }
  return <LuGlobe size={20} />
}

const claimedWebsite = (website?: Website): string | false => {
  if (!website) {
    return false
  }
  return getWebsiteUrl(website.vanityPath || '', false, website.domain)
}

export default function LinksSection(): React.JSX.Element | null {
  const [candidate] = usePublicCandidate()
  const urls = candidate?.urls
  const email = candidate?.email
  const claimed = candidate?.claimed
  const claimedObj = typeof claimed === 'object' && claimed !== null ? claimed : undefined

  const { website, details } = claimedObj || {}
  const { website: campaignWebsite } = details || {}
  const websiteUrl = claimedWebsite(website)
  const links: LinkItem[] = []
  if (websiteUrl) {
    links.push({
      url: websiteUrl,
      icon: <LuGlobe size={20} />,
      text: websiteUrl,
    })
  }
  if (campaignWebsite) {
    links.push({
      url: campaignWebsite,
      icon: <LuGlobe size={20} />,
      text: campaignWebsite,
    })
  }
  if (email) {
    links.push({
      url: `mailto:${email}`,
      icon: <LuMail size={20} />,
      text: email,
    })
  }
  if (urls && urls.length > 0) {
    links.push(
      ...urls.map((url: string) => ({
        url,
        icon: mapSocialIcon(url),
        text: url,
      })),
    )
  }
  if (links.length === 0) {
    return null
  }
  return (
    <div className="lg:w-[400px] pt-8 lg:mt-0">
      <Paper className="mb-8 border-none">
        <div className="">
          <H3 className="mb-4">Links</H3>

          {links &&
            links.map((link, index) => (
              <div
                className={`${
                  index === links.length - 1
                    ? 'mb-0 border-b-0'
                    : 'pb-4 mb-4 border-b border-gray-200'
                }`}
                key={link.url}
              >
                <a
                  href={link.url}
                  rel="noopener noreferrer nofollow"
                  className="flex items-center text-sm"
                >
                  <span>{link.icon}</span>
                  <span className="inline-block ml-2 text-blue">
                    {link.text}
                  </span>
                </a>
              </div>
            ))}
        </div>
      </Paper>
    </div>
  )
}
