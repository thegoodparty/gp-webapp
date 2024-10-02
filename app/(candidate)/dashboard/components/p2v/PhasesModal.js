'use client';

import PrimaryButton from '@shared/buttons/PrimaryButton';
import Button from '@shared/buttons/Button';
import Body2 from '@shared/typography/Body2';
import H1 from '@shared/typography/H1';
import H3 from '@shared/typography/H3';
import H6 from '@shared/typography/H6';
import Overline from '@shared/typography/Overline';
import Modal from '@shared/utils/Modal';
import Paper from '@shared/utils/Paper';
import { useState } from 'react';
import { BsPersonFillCheck } from 'react-icons/bs';
import { IoMdMegaphone } from 'react-icons/io';
import { MdHowToVote } from 'react-icons/md';
import Link from 'next/link';

export const phases = [
  {
    icon: <IoMdMegaphone />,
    phase: 'PHASE 1',
    title: 'Awareness',
    objective: 'Identify voter preferences, concerns, and support levels.',
    timing: '6-12+ months before your election.',
    size: 'Broad, slightly segmented (if at all).',
    link: '/blog/article/setting-the-stage-awareness-phase-of-political-campaigns',
  },
  {
    icon: <BsPersonFillCheck />,
    phase: 'PHASE 2',
    title: 'Contact',
    objective:
      'Target voters who are likely to be swayed by campaign messaging.',
    timing: '< 6 months - 6 weeks before your election.',
    size: 'Mid-sized, segmented slightly but not very granular.',
    link: '/blog/article/engaging-voters-contact-phase-of-a-political-campaign',
  },
  {
    icon: <MdHowToVote />,
    phase: 'PHASE 3',
    title: 'Vote',
    objective: 'Increase voter turnout among your supporters.',
    timing: 'The last 4-6 weeks leading up to your election.',
    size: 'Small, highly refined and discrete based on tactics.',
    link: '/blog/article/turning-support-into-victory-vote-phase-of-a-political-campaign',
  },
];

export function PhasesModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PrimaryButton
        variant="text"
        size="medium"
        onClick={() => {
          setOpen(true);
        }}
      >
        Learn More
      </PrimaryButton>
      <Modal
        closeCallback={() => {
          setOpen(false);
        }}
        open={open}
      >
        <div className="min-w-[80vw] lg:min-w-[800px]">
          <H1 className="text-center mb-8">About Phases</H1>
          <div className="mt-8 block flex flex-col md:flex-row gap-4 justify-between">
            <Body2 className="text-gray-600">
              GoodParty.org breaks down political campaigns into phases of how
              candidates should be connecting with their constituents.
            </Body2>
            <Link
              className="grow whitespace-nowrap"
              href="/blog/article/navigating-three-phases-of-a-successful-political-campaign"
              target="_blank"
            >
              <Button className="w-full md:w-auto" color="neutral">
                Read More
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-12 gap-4">
            {phases.map((phase, index) => (
              <div
                className="col-span-12 md:col-span-4 h-full"
                key={phase.title}
              >
                <Paper className="h-full flex flex-col">
                  <div className="text-5xl">{phase.icon}</div>
                  <Overline className="mt-3">{phase.phase}</Overline>
                  <H3>{phase.title}</H3>
                  <H6 className="mt-2">Objective</H6>
                  <Body2>{phase.objective}</Body2>
                  <H6 className="mt-2">Timing</H6>
                  <Body2>{phase.timing}</Body2>
                  <H6 className="mt-2">Audience Size</H6>
                  <Body2 className="mb-6">{phase.size}</Body2>
                  <Link href={phase.link} target="_blank" className="mt-auto">
                    <Button className="w-full" size="large" color="neutral">
                      Learn More
                    </Button>
                  </Link>
                </Paper>
              </div>
            ))}
          </div>
          <PrimaryButton
            fullWidth
            className="mt-8"
            onClick={() => setOpen(false)}
          >
            Close
          </PrimaryButton>
        </div>
      </Modal>
    </>
  );
}
