'use client';
import MaxWidth from '@shared/layouts/MaxWidth';
import { useState } from 'react';
import { LuStars } from 'react-icons/lu';
import { SlGraduation } from 'react-icons/sl';
import { RiHandHeartLine, RiTeamLine, RiLineChartLine } from 'react-icons/ri';

import TogglePanel from '@shared/utils/TogglePanel';
import Image from 'next/image';
import Pill from '@shared/buttons/Pill';
import RunCampaignButton from './RunCampaignButton';

const features = [
  {
    name: 'A.I.',
    title: 'A.I. Campaign Manager',
    description:
      'Plan and run a winning campaign for free with time-saving AI tools and actionable expertise from political pros',
  },
  {
    name: 'Mobilization',
    title: 'IRL Mobilization & Volunteers ',
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
  return (
    <section className="bg-[#13161a]">
      <MaxWidth>
        <div className="text-lg text-slate-400 text-center">What we do</div>
        <h2 className="text-center text-slate-100 text-4xl">
          Run your campaign with confidence
        </h2>
        <div className="grid grid-cols-12 gap-12">
          {features.map((feature) => (
            <div className="col-span-12 lg:col-span-4" key={feature.name}>
              <div className="flex h-[200px] w-[200px] rounded-full bg-gradient-to-br from-[#AFA8FF] to-amber-200 items-center justify-center">
                {feature.name === 'A.I.' ? (
                  <LuStars className="text-6xl text-black" />
                ) : feature.name === 'Mobilization' ? (
                  <SlGraduation className="text-6xl text-white" />
                ) : feature.name === 'Support' ? (
                  <RiHandHeartLine className="text-6xl text-white" />
                ) : (
                  <></>
                )}
              </div>
              <h3 className="text-4xl mt-12 text-slate-100">{feature.title}</h3>
              <p className="mt-8 text-xl max-w-[90vw] text-slate-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </MaxWidth>
    </section>
  );
}
