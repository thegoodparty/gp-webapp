'use client';
import Button from '@shared/buttons/Button';
import H2 from '@shared/typography/H2';
import Modal from '@shared/utils/Modal';
import { usePathname } from 'next/navigation';
import { memo, useState } from 'react';
import { FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { MdFacebook, MdShare } from 'react-icons/md';

export default memo(function ShareMap() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const appBase =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location?.origin
      : 'https://goodparty.org';
  const url = appBase + pathname;
  const encodedUrl = encodeURIComponent(url);
  const messageNoUrl =
    'Find independent, people-powered, and anti-corruption candidates running for office in your area.';

  let hash = '#GoodParty';
  const hashQueryTwitter = hash ? `&hashtags=${hash}` : '';
  const hashQueryFacebook = hash ? `&hashtag=${hash}` : '';

  const channels = [
    {
      label: 'Facebook',
      icon: <MdFacebook className="text-xl text-[#1877F2]" size={64} />,
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}${hashQueryFacebook}`,
    },

    {
      label: 'X',
      icon: <FaXTwitter size={64} className="text-black " />,
      link: `https://twitter.com/share?url=${encodedUrl}&text=${messageNoUrl}${hashQueryTwitter}`,
    },
    {
      label: 'LinkedIn',
      icon: <FaLinkedin size={64} className="text-[#0077B5]" />,
      link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  return (
    <div className="mt-8 bg-primary-dark px-4 lg:px-8 flex justify-center">
      <Button
        color="neutral"
        className="flex mx-4 items-center justify-center text-lg bg-white"
        onClick={() => {
          setOpen(true);
        }}
      >
        <MdShare className="mr-2 " />
        <span>Share This Map</span>
      </Button>
      <Modal
        open={open}
        closeCallback={() => {
          setOpen(false);
        }}
      >
        <div className="p-4">
          <H2>How would you like to share?</H2>
          <div className="mt-8 flex items-center justify-center">
            {channels.map((channel, index) => (
              <a
                key={channel.label}
                className="mx-4"
                href={channel.link}
                target="_blank"
                rel="noreferrer"
              >
                {channel.icon}
              </a>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
});
