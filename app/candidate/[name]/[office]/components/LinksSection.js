'use client'
import { FaGlobeAmericas, FaInstagram } from 'react-icons/fa'
import { FaFacebookF, FaTiktok, FaXTwitter } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
import { AiOutlineLinkedin } from 'react-icons/ai'
import { usePublicCandidate } from './PublicCandidateProvider'
import Paper from '@shared/utils/Paper'
import H3 from '@shared/typography/H3'
import { getWebsiteUrl } from 'app/(candidate)/dashboard/website/util/website.util'

function mapSocialIcon(url) {
  if (url.includes('twitter') || url.includes('/x.com')) {
    return <FaXTwitter size={20} />
  }
  if (url.includes('facebook')) {
    return <FaFacebookF size={20} />
  }
  if (url.includes('instagram')) {
    return <FaInstagram size={20} />
  }
  if (url.includes('tiktok')) {
    return <FaTiktok size={20} />
  }
  if (url.includes('linkedin')) {
    return <AiOutlineLinkedin size={20} />
  }
  if (url.includes('website')) {
    return <FaGlobeAmericas size={20} />
  }
  return <FaGlobeAmericas size={20} />
}

function claimedWebsite(website) {
  if (!website) {
    return false
  }
  return getWebsiteUrl(website.vanityPath, false, website.domain)
}

export default function LinksSection(props) {
  const [candidate] = usePublicCandidate()
  const { urls, email, claimed } = candidate

  const { website, details } = claimed || {}
  const { website: campaignWebsite } = details || {}
  const websiteUrl = claimedWebsite(website)
  const links = []
  if (websiteUrl) {
    links.push({
      url: websiteUrl,
      icon: <FaGlobeAmericas size={20} />,
      text: websiteUrl,
    })
  }
  if (campaignWebsite) {
    links.push({
      url: campaignWebsite,
      icon: <FaGlobeAmericas size={20} />,
      text: campaignWebsite,
    })
  }
  if (email) {
    links.push({
      url: `mailto:${email}`,
      icon: <MdEmail size={20} />,
      text: email,
    })
  }
  if (urls && urls.length > 0) {
    links.push(
      ...urls.map((url) => ({
        url,
        icon: mapSocialIcon(url),
        text: url,
      })),
    )
  }
  return (
    <div className="lg:w-[400px] pt-8 lg:mt-0">
      {((urls && urls.length > 0) || email) && (
        <Paper className="mb-8">
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
      )}
    </div>
  )
}
