'use client'

import PrimaryButton from '@shared/buttons/PrimaryButton'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import Modal from '@shared/utils/Modal'
import { numberFormatter } from 'helpers/numberHelper'
import { useState } from 'react'
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper'

const pathToVictoryExample = {
  averageTurnout: 1370,
  democrats: 561,
  electionLocation: 'NC##FLAT ROCK VLG',
  electionType: 'Village',
  indies: 1547,
  p2vCompleteDate: '2024-08-14',
  p2vStatus: 'Complete',
  projectedTurnout: 1386,
  republicans: 1114,
  totalRegisteredVoters: 3222,
  voterContactGoal: '3535.00',
  winNumber: '707.00',
}

export function P2vModal({ triggerElement, pathToVictory = {} }) {
  const [open, setOpen] = useState(false)

  const {
    totalRegisteredVoters,
    projectedTurnout,
    voterContactGoal,
    winNumber,
  } = pathToVictory
  let turnoutPerc = 0
  if (totalRegisteredVoters !== 0) {
    turnoutPerc = numberFormatter(
      (projectedTurnout / totalRegisteredVoters) * 100,
    )
  }

  return (
    <>
      <div
        className="cursor-pointer"
        onClick={() => {
          trackEvent(EVENTS.Dashboard.PathToVictory.ClickUnderstand)
          setOpen(true)
        }}
      >
        {triggerElement}
      </div>
      <Modal
        closeCallback={() => {
          trackEvent(EVENTS.Dashboard.PathToVictory.ExitUnderstand)
          setOpen(false)
        }}
        open={open}
      >
        <div className="min-w-[80vw] lg:min-w-[740px]">
          <H1 className="text-center mb-8">
            Understanding Your Path to Victory
          </H1>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-10">
              <Body1 className="mb-8">
                <strong>Your Path to Victory:</strong>
              </Body1>
              <ul>
                <li>
                  <Body1>
                    <strong>
                      {numberFormatter(totalRegisteredVoters)} Total Voters
                    </strong>{' '}
                    (in your district)
                  </Body1>
                </li>
                <li>
                  <Body1>
                    <strong>
                      {numberFormatter(projectedTurnout)} Expected Voters
                    </strong>{' '}
                    (based on {turnoutPerc}% turnout)
                  </Body1>
                </li>
                <li>
                  <Body1>
                    <strong>
                      {numberFormatter(winNumber)} Votes Needed to Win
                    </strong>{' '}
                    (this includes a small safety margin)
                  </Body1>
                </li>
              </ul>
              <Body1 className="my-8">
                <strong>What You Need to Do:</strong>
              </Body1>
              <ul>
                <li>
                  <Body1>
                    <strong>Contact {numberFormatter(winNumber)} Voters</strong>{' '}
                    (aim to reach each one at least 5 times)
                  </Body1>
                </li>
                <li>
                  <Body1>
                    <strong>
                      {numberFormatter(voterContactGoal)} Total Contacts Needed{' '}
                    </strong>{' '}
                    to ensure you turn out enough voters
                  </Body1>
                </li>
              </ul>
            </div>

            <div className="hidden md:flex flex-col md:col-span-2 tracking-wide  h-full  text-right justify-between font-normal font-sfpro text-base pb-4">
              <div> {numberFormatter(totalRegisteredVoters)}</div>
              <div>x {turnoutPerc}%</div>
              <div className="h-[1px] bg-slate-300"></div>

              <div>{numberFormatter(projectedTurnout)}</div>
              <div>x 50%</div>
              <div className="h-[1px] bg-slate-300"></div>

              <div>{numberFormatter(winNumber)}</div>
              <div>x 5</div>
              <div className="h-[1px] bg-slate-300"></div>

              <div>{numberFormatter(voterContactGoal)}</div>
            </div>
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
  )
}
