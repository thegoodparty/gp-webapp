import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import H5 from '@shared/typography/H5';
import Overline from '@shared/typography/Overline';
import { FaGlobeAmericas, FaInstagram, FaMapMarkerAlt } from 'react-icons/fa';
import {
  FaArrowRight,
  FaFacebookF,
  FaTiktok,
  FaXTwitter,
} from 'react-icons/fa6';
import { IoPersonSharp } from 'react-icons/io5';
import { MdEmail, MdStars } from 'react-icons/md';
import TealButton from './TealButton';
import StickyCard from './StickyCard';
import CTA from './CTA';
import Image from 'next/image';
import { AiOutlineLinkedin } from 'react-icons/ai';

function mapSocialIcon(type) {
  //<MdEmail size={20} />
  switch (type) {
    case 'website':
      return <FaGlobeAmericas size={20} />;
    case 'twitter':
      return <FaXTwitter size={20} />;
    case 'facebook':
      return <FaFacebookF size={20} />;
    case 'instagram':
      return <FaInstagram size={20} />;
    case 'tiktok':
      return <FaTiktok size={20} />;
    case 'linkedin':
      return <AiOutlineLinkedin size={20} />;
    default:
      return <FaGlobeAmericas size={20} />;
  }
}

export default function CandidateCard(props) {
  const { candidate } = props;
  const {
    firstName,
    lastName,
    party,
    office,
    city,
    state,
    claimed,
    image,
    socialUrls,
    email,
  } = candidate;

  let partyName = '';
  if (party === 'Independent') {
    partyName = 'Non-Partisan Candidate';
  }

  return (
    <div className="mb-4 lg:w-[400px]  -mt-16  lg:mr-4">
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
            <H5 className="ml-2">Running for {office}</H5>
          </div>
          <div className="flex mb-3 items-center mb-8">
            <FaMapMarkerAlt className="text-secondary-light" size={20} />
            <H5 className="ml-2">
              {city ? `${city}, ` : ''}
              {state}
            </H5>
          </div>
          {((socialUrls && socialUrls.length > 0) || email) && (
            <div
              className={`flex items-center opacity-50 mb-8 ${
                socialUrls.length > 3 ? 'justify-between' : ''
              }`}
            >
              {email && (
                <a
                  href={`mailto:${email}`}
                  rel="noopener noreferrer nofollow"
                  className={`inline-block ${
                    socialUrls.length > 3 ? '' : 'mr-6'
                  }`}
                >
                  <MdEmail size={20} />
                </a>
              )}
              {socialUrls &&
                socialUrls.map((url) => (
                  <a
                    href={url.url}
                    rel="noopener noreferrer nofollow"
                    key={url.url}
                    className={`inline-block ${
                      socialUrls.length > 3 ? '' : 'mr-6'
                    }`}
                  >
                    {mapSocialIcon(url.type)}
                  </a>
                ))}
            </div>
          )}
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
        </div>
      </StickyCard>
    </div>
  );
}
