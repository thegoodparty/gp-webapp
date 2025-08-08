import H1 from '@shared/typography/H1'
import H5 from '@shared/typography/H5'
import Overline from '@shared/typography/Overline'
import { FaGlobeAmericas, FaInstagram, FaMapMarkerAlt } from 'react-icons/fa'
import {
  FaArrowRight,
  FaFacebookF,
  FaTiktok,
  FaXTwitter,
} from 'react-icons/fa6'
import { IoPersonSharp } from 'react-icons/io5'
import { MdEmail, MdStars, MdVolunteerActivism } from 'react-icons/md'
import TealButton from './TealButton'
import StickyCard from './StickyCard'
import CTA from './CTA'
import Image from 'next/image'
import { AiOutlineLinkedin } from 'react-icons/ai'
import Body2 from '@shared/typography/Body2'

function mapSocialIcon(type) {
  //<MdEmail size={20} />
  switch (type) {
    case 'website':
      return <FaGlobeAmericas size={20} />
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

export default function CandidateCard(props) {
  const { candidate } = props
  const {
    firstName,
    lastName,
    party,
    city,
    state,
    image,
    socialUrls,
    email,
    positionName,
  } = candidate

  let partyName = ''
  if (party === 'Independent') {
    partyName = 'Non-Partisan Candidate'
  }

  return (
    <div className="mb-4 lg:w-[400px] lg:mr-4 pt-12 md:pt-0">
      <div className="lg:w-[400px]">&nbsp;</div>
      <StickyCard>
        <div className="mb-4 lg:w-[400px] bg-primary-dark p-6 rounded-2xl border border-gray-700">
          <div className="flex justify-between">
            {image ? (
              <div className="bg-primary inline-block border border-white rounded-2xl relative w-28 h-28">
                <Image
                  src={image}
                  fill
                  alt={`${firstName} ${lastName}`}
                  priority
                  unoptimized
                  className="rounded-2xl w-28 h-28 object-cover object-center"
                />
              </div>
            ) : (
              <div className="bg-primary inline-block border border-white rounded-2xl p-4">
                <IoPersonSharp size={60} />
              </div>
            )}
          </div>
          <Overline className="my-4">{partyName}</Overline>
          <H1 className="mb-4">
            {firstName} {lastName}
          </H1>
          <div className="flex mb-3 items-center">
            <MdStars className="text-secondary-light" size={20} />
            <H5 className="ml-2">{party}</H5>
          </div>
          <div className="flex mb-3 items-center">
            <IoPersonSharp className="text-secondary-light" size={20} />
            <H5 className="ml-2">Running for {positionName}</H5>
          </div>
          <div className="flex  items-center mb-8">
            <FaMapMarkerAlt className="text-secondary-light" size={20} />
            <H5 className="ml-2">
              {city ? `${city}, ` : ''}
              {state}
            </H5>
          </div>
          <div className="grid grid-cols-12 gap-4 mb-8">
            {((socialUrls && socialUrls.length > 0) || email) && (
              <>
                {email && (
                  <div className="col-span-6">
                    <a
                      href={`mailto:${email}`}
                      rel="noopener noreferrer nofollow"
                      className={`inline-block ${
                        socialUrls.length > 3 ? '' : 'mr-6'
                      }`}
                    >
                      <MdEmail size={20} /> Email
                    </a>
                  </div>
                )}
                {socialUrls &&
                  socialUrls.map((url) => (
                    <div className="col-span-6" key={url.url}>
                      <a
                        href={url.url}
                        rel="noopener noreferrer nofollow"
                        className="flex items-center"
                      >
                        <span>{mapSocialIcon(url.type)}</span>
                        <span className="inline-block ml-2">
                          {url.type === 'government' ? 'website' : url.type}
                        </span>
                      </a>
                    </div>
                  ))}
              </>
            )}
          </div>
          {/* <div className="p-3 text-center rounded border border-gray-300 font-medium cursor-pointer transition-colors hover:bg-white hover:text-primary mb-4">
            Learn More About {firstName} {lastName}
          </div> */}
          <CTA id="candidate-card-cta">
            <TealButton>
              <div className="flex items-center justify-center  ">
                <div className="mr-1">Access Voter Data &amp; Tools</div>
                <FaArrowRight />
              </div>
            </TealButton>
          </CTA>
          <div className="mt-8 flex border border-white p-2 rounded-lg">
            <MdVolunteerActivism size={30} />
            <Body2 className="ml-2">
              <strong>GoodParty.org</strong> helps non-partisan and independent
              candidates win their elections.
            </Body2>
          </div>
        </div>
      </StickyCard>
    </div>
  )
}
