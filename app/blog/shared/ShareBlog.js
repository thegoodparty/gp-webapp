'use client';
import { Fragment } from 'react';
import { usePathname } from 'next/navigation';
import { IoIosText } from 'react-icons/io';
import { FaFacebookF, FaTwitter } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { AiOutlineLink } from 'react-icons/ai';
import { appBase } from 'gpApi';

export default function ShareBlog() {
  const pathname = usePathname();
  const url = appBase + pathname;
  const messageNoUrl = 'Vote different';
  const encodedUrl = encodeURIComponent(url);
  const encodedMessageBody = `${messageNoUrl} \n\n ${encodedUrl}`;

  const textMessageBody = `${url} ${'\n %0a'} ${'\n %0a'}${messageNoUrl}`;

  const emailSubject = 'Check this out';
  const emailBody = `${messageNoUrl}%0D%0A%0D%0A${encodedUrl}%0D%0A%0D%0A GOOD PARTY%0D%0AFree software for free elections`;

  let hash = '#GoodParty';
  const hashQueryTwitter = hash ? `&hashtags=${hash}` : '';
  const hashQueryFacebook = hash ? `&hashtag=${hash}` : '';

  const channels = [
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
  ];

  return (
    <div className="hidden lg:block fixed top-[600px] right-[20px] h-screen flex flex-col justify-center items-center p-4">
      {channels.map((channel, index) => (
        <Fragment key={channel.label}>
          {channel.link && (
            <a
              href={channel.link}
              target="_blank"
              rel="noopener noreferrer nofollow"
              id={`${channel.label}-share`}
              className="p-10"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD481] to-[#C5F4FF] bg-opacity-20 flex justify-center items-center">
                {channel.icon}
              </div>
            </a>
          )}
        </Fragment>
      ))}
    </div>
  );
}
