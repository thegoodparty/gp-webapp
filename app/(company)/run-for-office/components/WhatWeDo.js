'use client';
import MaxWidth from '@shared/layouts/MaxWidth';
import { useState } from 'react';
import { LuStars } from 'react-icons/lu';
import { SlGraduation } from 'react-icons/sl';
import { RiHandHeartLine, RiTeamLine, RiLineChartLine } from 'react-icons/ri';
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
  // {
  //   name: 'Chaz M.',
  //   title: 'Firefighter',
  //   description:
  //     '“[Good Party shows that] there are tools out there for people who are not connected to any political parties, who dont have any money behind them.”',
  //   img: chazImg,
  // },
  // {
  //   name: 'Ben W.',
  //   title: 'Candidate for Maine House District 89',
  //   description:
  //     '“Being an independent means that it can be hard to run with no party to back you, but Good Party changed that. The staff at good party was friendly, inviting, and highly knowledgeable.”',
  //   img: benImg,
  // },
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
        <div className="flex justify-center mt-20">
          <div className="flex w-full lg:w-[80%] min-h-[300px]  bg-zinc-800 rounded-2xl mt-5">
            <div className="flex flex-col justify-center items-center text-center w-2/3">
              <h3 className="text-2xl text-slate-100 pr-5 pl-5">
                {sections[selected].description}
              </h3>

              <p className="mt-3 text-lg max-w-[90vw] text-slate-300">
                - {sections[selected].name}
              </p>
              <p className="mt-2 text-md max-w-[90vw] text-indigo-200">
                {sections[selected].title}
              </p>
            </div>
            <div className="flex flex-col justify-center items-center text-center w-1/3 rounded-2xl h-full relative">
              <Image
                src={sections[selected].img}
                fill
                sizes="100vw"
                className="object-cover rounded-tr-2xl rounded-br-2xl"
                alt={sections[selected].name}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex w-full lg:w-[80%] h-[auto] rounded-2xl items-center justify-center p-5">
            {sections.map((section, index) => (
              <div
                key={section.title}
                className={`w-4 h-4 rounded-full mx-2 border-white cursor-pointer ${
                  index === selected ? 'bg-[#DFF265]' : 'bg-[#2D343D]'
                }`}
                onClick={() => setSelected(index)}
              ></div>
            ))}
          </div>
        </div>
      </MaxWidth>

      <div className="flex relative justify-start -mb-[200px] w-auto h-auto">
        <Image
          src="/images/run-for-office/triangles.svg"
          width="200"
          height="200"
          className="ml-12"
        />
      </div>
    </section>
  );
}
