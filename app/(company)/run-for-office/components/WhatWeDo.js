'use client';
import MaxWidth from '@shared/layouts/MaxWidth';
import { useState } from 'react';
import { LuStars } from 'react-icons/lu';
import { SlGraduation } from 'react-icons/sl';
import { RiHandHeartLine, RiTeamLine, RiLineChartLine } from 'react-icons/ri';
import Image from 'next/image';
import testimonial1Img from 'public/images/run-page/testimonial1.png';
import toolsImg from 'public/images/landing-pages/tools.png';
import expertsImg from 'public/images/landing-pages/experts.png';
import insightsImg from 'public/images/landing-pages/insights.png';

const sections = [
  {
    title: 'Candidate for Maine House District 104',
    name: 'Anne Gass',
    description:
      '“As an Indie candidate without a part organization it meant a lot to me to have someone working hard to help me reach voters.”',
    img: testimonial1Img,
  },
  {
    title: 'Get help from experts',
    description:
      'We cut out expensive consultants by providing you free access to our team of experienced political professionals in fundraising, digital, field operations, and more.',
    img: expertsImg,
  },
  {
    title: 'Get access to cutting-edge AI tools',
    description:
      'Our AI-powered tools make campaigning smarter, faster and cheaper than ever and provide a  competitive edge over old-style, two-party politicians.',
    img: toolsImg,
  },
  {
    title: 'Actionable data, analysis and insights',
    description:
      'See where your voters are, and how to reach them.  Your free campaign tracker shows the path-to-victory and highlights the viability of your campaign.',
    img: insightsImg,
  },
];

const features = [
  {
    name: 'A.I.',
    title: 'A.I. Campaign Manager',
    description:
      'Plan and run a winning campaign for free with time-saving AI tools and actionable expertise from political pros',
  },
  {
    name: 'Academy',
    title: 'Good Party Academy',
    description:
      'Free course led by campaigning experts for first time candidates exploring a run for office',
  },
  {
    name: 'Support',
    title: 'Expert Volunteer Support',
    description:
      'Tap into our network of engaged volunteers ready to help you reach more voters',
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
              {feature.name === 'A.I.' ? (
                <div className="flex flex-col h-[200px] w-[200px] rounded-full bg-gradient-to-br from-[#AFA8FF] to-[#FFD78A] items-center justify-center self-center">
                  <LuStars className="text-6xl text-black" />
                </div>
              ) : feature.name === 'Academy' ? (
                <div className="flex h-[200px] w-[200px] rounded-full bg-gradient-to-br from-[#F9FFB1] to-[#FFD27A] items-center justify-center self-center">
                  <SlGraduation className="text-6xl text-black" />
                </div>
              ) : feature.name === 'Support' ? (
                <div className="flex h-[200px] w-[200px] rounded-full bg-gradient-to-br from-[#C5F4FF] to-[#FFD481] items-center justify-center self-center">
                  <RiHandHeartLine className="text-6xl text-black" />
                </div>
              ) : (
                <></>
              )}
              <h3 className="text-3xl mt-12 text-slate-100">{feature.title}</h3>
              <p className="mt-8 text-lg max-w-[90vw] text-slate-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-20">
          <div className="flex w-full lg:w-[80%] h-[300px] bg-zinc-800 rounded-2xl mt-5">
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
                className="object-contain"
                alt=""
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

      <div className="flex relative justify-start -mb-[200px]">
        <Image
          src="/images/run-page/triangles.svg"
          width="200"
          height="200"
          className="ml-12"
        />
      </div>
    </section>
  );
}
