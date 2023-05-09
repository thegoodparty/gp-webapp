'use client';

import { hexToRgb } from '@shared/candidates/GoalsChart';
import Modal from '@shared/utils/Modal';
import { useState } from 'react';
import { FaShare, FaThumbsUp } from 'react-icons/fa';
import { FiDollarSign } from 'react-icons/fi';
import { GiSandsOfTime } from 'react-icons/gi';
import FollowButton from './FollowButton';
import ShareCandidate from './ShareCandidate';

export default function GetInvolvedButton({ color, candidate, textColor }) {
  console.log('can', candidate);
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const rgb = hexToRgb(color);

  const shareCandidateCallback = () => {
    setShowModal(false);
    setShowShareModal(true);
  };

  const actions = [
    // {
    //   title: 'FOLLOW',
    //   desc: 'Follow this campaign to stay in the loop',
    //   icon: <FaShare />,
    // },
    {
      title: 'ENDORSE',
      desc: 'Tell others about this candidate',
      icon: <FaThumbsUp />,
      callback: shareCandidateCallback,
    },
    // {
    //   title: 'DONATE',
    //   desc: 'Donate to their campaign success',
    //   icon: <FiDollarSign />,
    // },
    {
      title: 'VOLUNTEER',
      desc: 'Volunteer for their campaign',
      icon: <GiSandsOfTime />,
      link: '/volunteer',
    },
  ];

  const WrapperElement = ({ action, children, key }) => {
    if (action.link) {
      return (
        <a
          href={action.link}
          target="_blank"
          key={key}
          className="no-underline"
        >
          {children}
        </a>
      );
    }
    return <div key={key}>{children}</div>;
  };

  return (
    <>
      <div
        className="inline-block px-8 py-4 text-lg font-black bg-white rounded-full cursor-pointer"
        style={{ color }}
        onClick={() => setShowModal(true)}
      >
        GET INVOLVED
      </div>
      <Modal
        open={showModal}
        closeCallback={() => setShowModal(false)}
        boxStyle={{
          padding: 0,
        }}
      >
        <div
          className="p-6"
          style={{ backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)` }}
        >
          <div className="text-2xl font-black my-5">
            Let&apos;s help this candidate get elected!
          </div>
          <FollowButton
            candidate={candidate}
            color={color}
            textColor={textColor}
          />
          {actions.map((action) => (
            <WrapperElement action={action} key={action.title}>
              <div
                className="flex items-center justify-between bg-white py-2 px-4 mt-2 rounded-md cursor-pointer"
                key={action.title}
                onClick={action.callback}
              >
                <div className="">
                  <div className="flex-1 font-black text-xl tracking-wider">
                    {action.title}
                  </div>
                  <div className="mt-1">{action.desc}</div>
                </div>
                <div className="text-2xl" style={{ color: color }}>
                  {action.icon}
                </div>
              </div>
            </WrapperElement>
          ))}
        </div>
      </Modal>
      <Modal
        open={showShareModal}
        closeCallback={() => setShowShareModal(false)}
      >
        <ShareCandidate candidate={candidate} />
      </Modal>
    </>
  );
}
