import Pill from '@shared/buttons/Pill';
import { candidateHash } from 'helpers/candidateHelper';
import Image from 'next/image';
import {
  FaShare,
  FaTwitter,
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaSnapchatGhost,
  FaTwitch,
} from 'react-icons/fa';

export const channels = [
  { label: 'Twitter', key: 'twitter', icon: <FaTwitter /> },
  { label: 'Instagram', key: 'instagram', icon: <FaInstagram /> },
  { label: 'Facebook', key: 'facebook', icon: <FaFacebookF /> },
  { label: 'LinkedIn', key: 'linkedin', icon: <FaLinkedinIn /> },
  { label: 'TikTok', key: 'tiktok', icon: <FaTiktok /> },
  { label: 'Snap', key: 'snap', icon: <FaSnapchatGhost /> },
  { label: 'Twitch', key: 'twitch', icon: <FaTwitch /> },
];

export default function SocialSection(props) {
  const { candidate, color, textColor } = props;
  const hashtag = candidateHash(candidate);

  const socialChannels = [];
  channels.forEach((channel) => {
    if (candidate[channel.key]) {
      socialChannels.push({ ...channel, url: candidate[channel.key] });
    }
  });

  return (
    <section className="relative  my-3 rounded-2xl overflow-hidden">
      <div
        className="absolute h-full w-full opacity-30 rounded-2xl"
        style={{ backgroundColor: color }}
      />
      <div className="absolute bg-white rounded-full h-40 w-40 -right-10 -top-20" />
      <div className="absolute right-4 top-4">
        <Image src="/images/heart.svg" alt="GP" width={59} height={47} />
      </div>
      <div className="p-6 relative z-10">
        <h3 className="text-2xl pr-24 lg:pr-0">
          Get me trending, tag posts with
        </h3>
        <div className="text-2xl font-black mt-3 mb-6" style={{ color }}>
          #{hashtag}
        </div>
        <div className="flex items-center" style={{ color: color }}>
          <Pill
            style={{
              backgroundColor: color,
              color: textColor,
              borderColor: color,
            }}
            className="mr-5"
          >
            <div className="flex items-center" style={{ color: textColor }}>
              <FaShare className="mr-2" /> Share
            </div>
          </Pill>
          {socialChannels.map((channel) => (
            <a
              href={channel.url}
              key={channel.key}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <div className="pr-3 text-2xl">{channel.icon}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
