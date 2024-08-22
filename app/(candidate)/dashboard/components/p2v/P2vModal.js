'use client';

import PrimaryButton from '@shared/buttons/PrimaryButton';
import Body1 from '@shared/typography/Body1';
import Body2 from '@shared/typography/Body2';
import H1 from '@shared/typography/H1';
import Modal from '@shared/utils/Modal';
import { numberFormatter } from 'helpers/numberHelper';
import { useState } from 'react';

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
};

export function P2vModal({ triggerElement, pathToVictory = {} }) {
  const [open, setOpen] = useState(false);

  const { totalRegisteredVoters, projectedTurnout, voterContactGoal } =
    pathToVictory;
  let turnoutPerc = 0;
  if (totalRegisteredVoters !== 0) {
    turnoutPerc = numberFormatter(
      (projectedTurnout / totalRegisteredVoters) * 100,
    );
  }

  return (
    <>
      <div
        className="cursor-pointer"
        onClick={() => {
          setOpen(true);
        }}
      >
        {triggerElement}
      </div>
      <Modal
        closeCallback={() => {
          setOpen(false);
        }}
        open={open}
      >
        <div className="min-w-[80vw] lg:min-w-[740px]">
          <H1 className="text-center mb-8">
            Understanding Your Path to Victory
          </H1>
          <Body1>
            You have{' '}
            <strong>{numberFormatter(totalRegisteredVoters)} voters</strong> in
            your district.
            <br />
            Expected <strong>voter turnout is {turnoutPerc}%*</strong> in your
            race. <br />
            That means,{' '}
            <strong>
              approx. {numberFormatter(projectedTurnout)} people
            </strong>{' '}
            will vote in your election.
            <br />
            <br />
            You need a minimum of <strong>51%</strong> of those votes. <br />
            You should target <strong>{targetVotes} votes**</strong> in order to
            win.
            <br />
            <br />
            You need to contact those{' '}
            <strong>{targetVotes} voters a minimum of 5x.</strong> <br />
            That equals{' '}
            <strong>
              {numberFormatter(parseInt(voterContactGoal) * 5)} voter contacts.
            </strong>
          </Body1>
          <Body2 className="mt-8 text-gray-600">
            * Your turnout rate is calculated by the last 3 election cycles.
            <br />
            ** A margin of 2.5% has been added to the minimum projected number
            of votes needed to win.
          </Body2>
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
