'use client'
import { FaGlobeAmericas, FaInstagram } from 'react-icons/fa'
import { FaFacebookF, FaTiktok, FaXTwitter } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
import { AiOutlineLinkedin } from 'react-icons/ai'
import { usePublicCandidate } from './PublicCandidateProvider'
import Paper from '@shared/utils/Paper'
import H3 from '@shared/typography/H3'

function mapSocialIcon(url) {
  if (url.includes('twitter')) {
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

export default function LinksSection(props) {
  const [candidate] = usePublicCandidate()
  const { urls, email, claimed } = candidate

  const { website } = claimed || {}

  return (
    <div className="lg:w-[400px] pt-8 lg:mt-0">
      {((urls && urls.length > 0) || email) && (
        <Paper className="mb-8">
          <div className="">
            <H3 className="mb-4">Links</H3>
            {website && (
              <div className="">
                <a href={website} rel="noopener noreferrer nofollow">
                  <FaGlobeAmericas size={20} /> Website
                </a>
              </div>
            )}
            {email && (
              <div className="">
                <a
                  href={`mailto:${email}`}
                  rel="noopener noreferrer nofollow"
                  className={`inline-block`}
                >
                  <MdEmail size={20} /> Email
                </a>
              </div>
            )}
            {urls &&
              urls.map((url, index) => (
                <div
                  className={`${
                    index === urls.length - 1
                      ? 'mb-0 border-b-0'
                      : 'pb-4 mb-4 border-b border-gray-200'
                  }`}
                  key={url}
                >
                  <a
                    href={url}
                    rel="noopener noreferrer nofollow"
                    className="flex items-center text-sm"
                  >
                    <span>{mapSocialIcon(url)}</span>
                    <span className="inline-block ml-2 text-blue">{url}</span>
                  </a>
                </div>
              ))}
          </div>
        </Paper>
      )}
    </div>
  )
}
