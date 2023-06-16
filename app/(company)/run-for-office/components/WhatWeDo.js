'use client';
import MaxWidth from '@shared/layouts/MaxWidth';
import { useState } from 'react';
import { LuStars } from 'react-icons/lu';
import { SlGraduation } from 'react-icons/sl';
import { RiHandHeartLine, RiTeamLine, RiLineChartLine } from 'react-icons/ri';
import Carousel from '@shared/inputs/Carousel';
import Image from 'next/image';
import Link from 'next/link';

const sections = [
  {
    title: 'Candidate for Maine House District 104',
    name: 'Anne G.',
    description:
      '“As an Indie candidate without a part organization it meant a lot to me to have someone working hard to help me reach voters.”',
    img: '/images/run-for-office/anne.jpg',
  },
  {
    name: 'Breanna S.',
    title: 'Fintech Founder',
    description:
      '“Working with the different AI tools was an amazing experience because… I was able to see what it would be like to enter my message from my own vocabulary, my own heart and mind and have AI just slightly tweak it in order to be the best version for the type of audience Im trying to engage with.”',
    img: '/images/run-for-office/breanna.jpg',
  },
  {
    name: 'Carlos R.',
    title: 'Regulatory Writer',
    description:
      '“[Good Party shows that] there are tools out there for people who are not connected to any political parties, who dont have any money behind them.”',
    img: '/images/run-for-office/carlos.jpg',
  },
];

const features = [
  {
    name: 'A.I.',
    title: 'A.I. Campaign Manager',
    description:
      'Plan and run a winning campaign for free with time-saving AI tools and actionable expertise from political pros',
    icon: <LuStars className="text-6xl text-black" />,
    bg_from: 'from-[#AFA8FF]',
    bg_to: 'to-[#FFD78A]',
    link: '',
  },
  {
    name: 'Academy',
    title: 'Good Party Academy',
    description:
      'Free course led by campaigning experts for first time candidates exploring a run for office',
    icon: <SlGraduation className="text-6xl text-black" />,
    bg_from: 'from-[#F9FFB1]',
    bg_to: 'to-[#FFD27A]',
    link: '/academy',
  },
  {
    name: 'Support',
    title: 'Expert Volunteer Support',
    description:
      'Tap into our network of engaged volunteers ready to help you reach more voters',
    icon: <RiHandHeartLine className="text-6xl text-black" />,
    bg_from: 'from-[#C5F4FF]',
    bg_to: 'to-[#FFD481]',
    link: '/volunteer',
  },
];

export default function WhatWeDo({ demoCallback }) {
  const [selected, setSelected] = useState(0);

  return (
    <section className="bg-[#13161a]">
      <MaxWidth>
        <div className="text-lg text-slate-400 text-center">What we do</div>
        <h2 className="text-center text-slate-100 text-6xl">
          Run your campaign
        </h2>
        <h2 className="text-center text-slate-100 text-6xl">with confidence</h2>
        <div className="grid grid-cols-12 gap-12 items-center justify-center text-center mt-8">
          {features.map((feature) => (
            <div
              className="col-span-12 lg:col-span-4 flex flex-col items-center justify-center"
              key={feature.name}
            >
              <div
                className={`flex flex-col h-[200px] w-[200px] rounded-full bg-gradient-to-br ${feature.bg_from} ${feature.bg_to} items-center justify-center self-center`}
              >
                {feature.icon}
              </div>
              <h3 className="text-3xl mt-12 text-slate-100">{feature.title}</h3>
              <p className="mt-8 text-lg max-w-[90vw] text-slate-300">
                {feature.description}
              </p>
              {feature.link == '' ? (
                <p
                  href={feature.link}
                  onClick={demoCallback}
                  className="mt-5 text-md text-lime-500 hover:underline cursor-pointer"
                >
                  Learn More
                </p>
              ) : (
                <Link
                  href={feature.link}
                  className="mt-5 text-md text-lime-500"
                >
                  Learn More
                </Link>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-20 pb-10">
          <Carousel sections={sections} />
        </div>
      </MaxWidth>

      <div className="flex absolute justify-start md:mt-5 lg:mt-10 w-auto h-auto overlay z-50">
        <Image
          src="/images/run-for-office/triangles.svg"
          width="200"
          height="200"
          className="ml-12"
          alt="triangles"
        />
      </div>
    </section>
  );
}
