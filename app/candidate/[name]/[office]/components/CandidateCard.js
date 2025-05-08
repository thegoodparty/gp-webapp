import Image from 'next/image'
import { IoPersonSharp } from 'react-icons/io5'
import {
  FaGlobeAmericas,
  FaInstagram,
  FaMapMarkerAlt,
} from 'react-icons/fa'
import {
  FaArrowRight,
  FaFacebookF,
  FaTiktok,
  FaXTwitter,
} from 'react-icons/fa6'
import { MdEmail, MdStars, MdVolunteerActivism } from 'react-icons/md'
import { AiOutlineLinkedin } from 'react-icons/ai'

import H1 from '@shared/typography/H1'
import H5 from '@shared/typography/H5'
import Overline from '@shared/typography/Overline'
import Body2 from '@shared/typography/Body2'
import TealButton from './TealButton'
import StickyCard from './StickyCard'
import CTA from './CTA'

/* helpers */
const mapSocialIcon = (type) => {
  switch (type) {
    case 'twitter':
      return <FaXTwitter size={20} />
    case 'facebook':
      return <FaFacebookF size={20} />
    case 'instagram':
      return <FaInstagram size={20} />
    case 'tiktok':
      return <FaTiktok size={20} />
    case 'linkedin':
      return <AiOutlineLinkedin size={20} />
    default:
      return <FaGlobeAmericas size={20} />
  }
}

const detectSocialType = (url) => {
  if (url.includes('twitter.com')) return 'twitter'
  if (url.includes('facebook.com')) return 'facebook'
  if (url.includes('instagram.com')) return 'instagram'
  if (url.includes('tiktok.com')) return 'tiktok'
  if (url.includes('linkedin.com')) return 'linkedin'
  return 'website'
}

const prettyUrl = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

/* component */
export default function CandidateCard({ candidate, variant = 'profile' }) {
  const {
    firstName,
    lastName,
    party,
    positionName,
    placeName,
    state,
    image,
    urls = [],
    email,
  } = candidate

  const partyName =
    party === 'Independent' || party === 'Nonpartisan'
      ? 'Non-Partisan Candidate'
      : ''

  const Wrapper =
    variant === 'profile'
      ? ({ children }) => <StickyCard>{children}</StickyCard>
      : ({ children }) => <>{children}</>

  return (
    <div
      className={`mb-6 ${
        variant === 'profile' ? 'lg:w-[400px] pt-12 md:pt-0' : ''
      }`}
    >
      {variant === 'profile' && <div className="lg:w-[400px]" />}

      <Wrapper>
        <div
          className={`bg-primary-dark p-6 rounded-2xl border border-gray-700
          ${variant === 'grid' ? 'text-white h-full flex flex-col' : ''}`}
        >
          {/* head-shot */}
          <div className="flex justify-between mb-4">
            {image ? (
              <div className="bg-primary inline-block border border-white rounded-2xl relative w-28 h-28">
                <Image
                  src={image}
                  fill
                  alt={`${firstName} ${lastName}`}
                  priority
                  unoptimized
                  className="rounded-2xl object-cover object-center"
                />
              </div>
            ) : (
              <div className="bg-primary inline-block border border-white rounded-2xl p-4">
                <IoPersonSharp size={60} />
              </div>
            )}
          </div>

          {/* Non-partisan tag — profile only */}
          {variant === 'profile' && (
            <Overline className="my-4">{partyName}</Overline>
          )}

          <H1 className="mb-4">
            {firstName} {lastName}
          </H1>

          {/* Party line — profile only */}
          {variant === 'profile' && (
            <div className="flex mb-3 items-center">
              <MdStars className="text-secondary-light" size={20} />
              <H5 className="ml-2">{party}</H5>
            </div>
          )}

          {/* Position line — profile only */}
          {variant === 'profile' && (
            <div className="flex mb-3 items-center">
              <IoPersonSharp className="text-secondary-light" size={20} />
              <H5 className="ml-2">Running for {positionName}</H5>
            </div>
          )}

          {/* Location — profile only */}
          {variant === 'profile' && (
            <div className="flex items-center mb-8">
              <FaMapMarkerAlt className="text-secondary-light" size={20} />
              <H5 className="ml-2">
                {placeName ? `${placeName}, ` : ''}
                {state}
              </H5>
            </div>
          )}

          {/* Social / email — profile only */}
          {variant === 'profile' && (email || urls.length > 0) && (
            <ul className="mb-8 space-y-2">
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    rel="noopener noreferrer nofollow"
                    className="flex items-center space-x-2 break-all"
                  >
                    <MdEmail size={20} />
                    <span>{email}</span>
                  </a>
                </li>
              )}

              {urls.map((url) => {
                const type = detectSocialType(url)
                return (
                  <li key={url}>
                    <a
                      href={url}
                      rel="noopener noreferrer nofollow"
                      className="flex items-center space-x-2 break-all"
                    >
                      {mapSocialIcon(type)}
                      <span>{prettyUrl(url)}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          )}

          {/* CTA — profile only */}
          {variant === 'profile' && (
            <CTA id="candidate-card-cta" className="mt-auto">
              <TealButton>
                <div className="flex items-center justify-center">
                  <span className="mr-1">Access Voter Data &amp; Tools</span>
                  <FaArrowRight />
                </div>
              </TealButton>
            </CTA>
          )}

          {/* Footer — profile only */}
          {variant === 'profile' && (
            <div className="mt-8 flex border border-white p-2 rounded-lg">
              <MdVolunteerActivism size={30} />
              <Body2 className="ml-2">
                <strong>GoodParty.org</strong> helps non-partisan and independent
                candidates win their elections.
              </Body2>
            </div>
          )}
        </div>
      </Wrapper>
    </div>
  )
}
