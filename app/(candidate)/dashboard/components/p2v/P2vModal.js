'use client';

import PrimaryButton from '@shared/buttons/PrimaryButton';
import Body1 from '@shared/typography/Body1';
import Body2 from '@shared/typography/Body2';
import H1 from '@shared/typography/H1';
import Modal from '@shared/utils/Modal';
import { useState } from 'react';

export function P2vModal({ triggerElement }) {
  const [open, setOpen] = useState(false);

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
            You have <strong>10,000 voters</strong> in your district.
            <br />
            Expected <strong>voter turnout is 50%*</strong> in your race. <br />
            That means, <strong>approx. 5,000 people</strong> will vote in your
            election.
            <br />
            <br />
            You need a minimum of <strong>50% + 1 vote</strong> of those votes.{' '}
            <br />
            You should target <strong>2,626 votes**</strong> in order to win.
            <br />
            <br />
            You need to contact those{' '}
            <strong>2,625 voters a minimum of 5x.</strong> <br />
            That equals <strong>13,125 voter contacts.</strong>
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
