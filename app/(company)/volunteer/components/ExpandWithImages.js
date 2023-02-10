'use client';
import Image from 'next/image';
import MaxWidth from '@shared/layouts/MaxWidth';
import defaultImg from '/public/images/landing-pages/volunteer-default.png';
import teamImg from '/public/images/landing-pages/volunteer-team.png';
import communityImg from '/public/images/landing-pages/volunteer-community.png';
import opImg from '/public/images/landing-pages/volunteer-opportunities.png';
import partyImg from '/public/images/landing-pages/volunteer-partiers.png';
import funImg from '/public/images/landing-pages/volunteer-fun.png';
import { useState } from 'react';
import { TfiArrowCircleRight } from 'react-icons/tfi';
import { MdOutlineCancel } from 'react-icons/md';

const items = [
  {
    title: 'Meet our team',
    description:
      "No matter your skills, interests, and availability, let's meet to kick off your journey with Good Party.",
    img: teamImg,
  },
  {
    title: 'Join our community',
    description:
      "We'll add you to the Good Party Discord where we coordinate and congregate to win elections nationwide.",
    img: communityImg,
  },
  {
    title: 'Plug into opportunities',
    description:
      'Match your skills with volunteer opportunities on promising campaigns in-person or virtually.',
    img: opImg,
  },
  {
    title: 'Meet more Good Partiers',
    description:
      'Make friends and grow the movement at monthly virtual meetings, local meet-ups, and daily discord discussions.',
    img: partyImg,
  },
  {
    title: 'Have fun',
    description:
      "We'll add you to the Good Party Discord where we coordinate and congregate to win elections nationwide.",
    img: funImg,
  },
];

export default function ExpandWithImages() {
  const [selected, setSelected] = useState(false);

  const handleSelect = (i) => {
    if (i === selected) {
      setSelected(false);
    } else {
      setSelected(i);
    }
  };

  return (
    <section className="mt-12">
      <div className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-6">
          <div className="w-[120%] -ml-[10%] lg:ml-8">
            <Image
              src={selected !== false ? items[selected].img : defaultImg}
            />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 -mt-5 lg:mt-0">
          {items.map((item, i) => (
            <>
              <div
                className={`bg-white text-2xl py-8 px-12 font-black rounded-xl mt-2.5 shadow-[0_0_8px_2px_rgba(0,0,0,0.1)] flex justify-between items-center cursor-pointer relative z-10 ${
                  selected === false
                    ? 'flex'
                    : ` ${selected === i ? 'flex' : 'hidden lg:flex'}`
                }`}
                onClick={() => {
                  handleSelect(i);
                }}
              >
                <div>
                  Step {i + 1}: {item.title}
                </div>
                <div>
                  <div className="hidden lg:block">
                    <TfiArrowCircleRight
                      size={24}
                      className={`transition ${selected === i && 'rotate-90'}`}
                    />
                  </div>
                  <div className="lg:hidden">
                    {selected === i ? (
                      <MdOutlineCancel size={24} />
                    ) : (
                      <TfiArrowCircleRight
                        size={24}
                        className={`transition ${
                          selected === i && 'rotate-90'
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>
              {selected === i && (
                <div className="bg-white text-2xl p-12 -mt-2 shadow-[0_0_8px_2px_rgba(0,0,0,0.1)] rounded-b-xl leading-relaxed">
                  {item.description}
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </section>
  );
}
