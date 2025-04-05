'use client'

import PrimaryButton from '@shared/buttons/PrimaryButton'
import Button from '@shared/buttons/Button'
import Body2 from '@shared/typography/Body2'
import H1 from '@shared/typography/H1'
import H3 from '@shared/typography/H3'
import H6 from '@shared/typography/H6'
import Overline from '@shared/typography/Overline'
import Modal from '@shared/utils/Modal'
import Paper from '@shared/utils/Paper'
import { useState } from 'react'
import { BsPersonFillCheck } from 'react-icons/bs'
import { IoMdMegaphone } from 'react-icons/io'
import { MdHowToVote } from 'react-icons/md'
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper'

export const phases = [
  {
    icon: <IoMdMegaphone />,
    phase: 'PHASE 1',
    title: 'Awareness',
    objective: 'Identify voter preferences, concerns, and support levels.',
    timing: '6-12+ months before your election.',
    size: 'Broad, slightly segmented (if at all).',
    link: '/blog/article/setting-the-stage-awareness-phase-of-political-campaigns',
    onClick: () =>
      trackEvent(EVENTS.Dashboard.PathToVictory.LearnMore.ClickAwareness),
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
    onClick: () =>
      trackEvent(EVENTS.Dashboard.PathToVictory.LearnMore.ClickContact),
  },
  {
    icon: <MdHowToVote />,
    phase: 'PHASE 3',
    title: 'Vote',
    objective: 'Increase voter turnout among your supporters.',
    timing: 'The last 4-6 weeks leading up to your election.',
    size: 'Small, highly refined and discrete based on tactics.',
    link: '/blog/article/turning-support-into-victory-vote-phase-of-a-political-campaign',
    onClick: () =>
      trackEvent(EVENTS.Dashboard.PathToVictory.LearnMore.ClickVote),
  },
]

export function PhasesModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <PrimaryButton
        variant="text"
        size="medium"
        onClick={() => {
          trackEvent(EVENTS.Dashboard.PathToVictory.ClickLearnMore)
          setOpen(true)
        }}
      >
        Learn More
      </PrimaryButton>
      <Modal
        closeCallback={() => {
          trackEvent(EVENTS.Dashboard.PathToVictory.LearnMore.Exit)
          setOpen(false)
        }}
        open={open}
      >
        <div className="min-w-[80vw] lg:min-w-[800px]">
          <H1 className="text-center mb-8">About Phases</H1>
          <Body2 className="mt-8 text-gray-600 text-center">
            GoodParty.org breaks down political campaigns into phases of how
            candidates should be connecting with their constituents.
          </Body2>

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
                  <Button
                    href={phase.link}
                    target="_blank"
                    className="w-full mt-auto"
                    size="large"
                    color="neutral"
                    onClick={phase.onClick}
                  >
                    Learn More
                  </Button>
                </Paper>
              </div>
            ))}
          </div>
          <PrimaryButton
            fullWidth
            className="mt-8"
            onClick={() => {
              trackEvent(EVENTS.Dashboard.PathToVictory.LearnMore.Exit)
              setOpen(false)
            }}
          >
            Close
          </PrimaryButton>
        </div>
      </Modal>
    </>
  )
}
