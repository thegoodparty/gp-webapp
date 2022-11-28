'use client';
import Modal from '@shared/utils/Modal';
import { Fragment, Suspense, useState } from 'react';
import { MdIosShare } from 'react-icons/md';
import { usePathname } from 'next/navigation';
import { candidateHash } from 'helpers/candidateHelper';

import { IoIosText, IoLogoWhatsapp } from 'react-icons/io';
import { FaFacebookF, FaFacebookMessenger, FaTwitter } from 'react-icons/fa';
import { BiLinkAlt } from 'react-icons/bi';
import { RiSendPlaneFill } from 'react-icons/ri';

import styles from './ShareCandidate.module.scss';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';

const appBase = process.env.APP_BASE || 'https://dev.goodparty.org';

export default function ShareCandidate({ candidate }) {
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();
  const url = appBase + pathname;
  const messageNoUrl = 'Vote different';
  const encodedUrl = encodeURIComponent(url);
  const encodedMessageBody = `${messageNoUrl} \n\n ${encodedUrl}`;

  const textMessageBody = `${url} ${'\n %0a'} ${'\n %0a'}${messageNoUrl}`;

  const emailSubject = 'Check this out';
  const emailBody = `${messageNoUrl}%0D%0A%0D%0A${encodedUrl}%0D%0A%0D%0A GOOD PARTY%0D%0AFree software for free elections`;

  let hash;
  if (candidate) {
    hash = candidateHash(candidate);
  }
  const hashQueryTwitter = hash ? `&hashtags=${hash}` : '';
  const hashQueryFacebook = hash ? `&hashtag=${hash}` : '';

  const channels = [
    {
      label: 'Twitter',
      icon: <FaTwitter />,
      className: 'twitter',
      link: `https://twitter.com/share?url=${encodedUrl}&text=${messageNoUrl}${hashQueryTwitter}`,
    },
    {
      label: 'Facebook',
      icon: <FaFacebookF />,
      className: 'facebook',
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}${hashQueryFacebook}`,
    },
    {
      label: 'Messenger',
      icon: <FaFacebookMessenger />,
      className: 'messenger',
      link: `fb-messenger://share/?app_id=241239336921963&link=${encodedUrl}${hashQueryFacebook}`,
    },
    {
      label: 'Text message',
      icon: <IoIosText />,
      className: 'sms',
      link: `sms:?&body=${textMessageBody.replace('&', '%26')}`,
    },
    {
      label: 'WhatsApp',
      icon: <IoLogoWhatsapp />,
      className: 'whatsapp',
      link: `https://api.whatsapp.com/send?text=${encodedMessageBody}`,
    },
    {
      label: 'Email',
      icon: <RiSendPlaneFill />,
      className: 'email',
      link: `mailto:?body=${emailBody}&subject=${emailSubject}`,
    },
  ];

  return (
    <>
      <MdIosShare
        size={30}
        style={{ color: '#868686', marginLeft: '18px', cursor: 'pointer' }}
        onClick={() => setShowModal(true)}
      />
      {showModal && (
        <Suspense>
          <Modal
            open
            closeCallback={() => {
              setShowModal(false);
            }}
          >
            <div
              style={{ width: '60vw', maxWidth: '450px', minWidth: '300px' }}
              className="p-6"
            >
              <h3 className="text-2xl font-black my-4">Share On</h3>
              {channels.map((channel, index) => (
                <Fragment key={channel.label}>
                  {channel.link && (
                    <div
                      className=" py-4 border-t border-t-gray-200 flex items-center justify-between"
                      data-cy="share-item"
                    >
                      <div className="flex items-center">
                        <div
                          className={`${styles.shareLink} ${channel.className}`}
                          style={
                            channel.label === 'Website'
                              ? { backgroundColor: brightColor }
                              : {}
                          }
                        >
                          {channel.icon}
                        </div>
                        <div className="ml-4">{channel.label}</div>
                      </div>
                      <a
                        href={channel.link}
                        onClick={() => {
                          trackShare(channel.label);
                        }}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        id={`${channel.label}-share`}
                      >
                        <BlackButtonClient>
                          <div className="text-xs font-black">Share</div>
                        </BlackButtonClient>
                      </a>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </Modal>
        </Suspense>
      )}
    </>
  );
}
