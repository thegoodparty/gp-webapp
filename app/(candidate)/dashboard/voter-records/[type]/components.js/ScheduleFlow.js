'use client';
import Body1 from '@shared/typography/Body1';
import Body2 from '@shared/typography/Body2';
import H1 from '@shared/typography/H1';
import Modal from '@shared/utils/Modal';
import { useState } from 'react';
import { IoArrowForward } from 'react-icons/io5';
import ScheduleFlowStep1 from './ScheduleFlowStep1';
import ScheduleFlowStep2 from './ScheduleFlowStep2';
import ScheduleFlowStep3 from './ScheduleFlowStep3';

export default function ScheduleFlow(props) {
  const [open, setOpen] = useState(true);
  const [state, setState] = useState({
    step: 1,
    budget: 0,
  });

  const handleChange = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleNext = () => {
    setState({
      ...state,
      step: state.step + 1,
    });
  };

  const handleBack = () => {
    setState({
      ...state,
      step: state.step - 1,
    });
  };

  const childProps = {
    onChangeCallback: handleChange,
    closeCallback: handleClose,
    nextCallback: handleNext,
    backCallback: handleBack,
  };

  return (
    <>
      <div
        className="mt-4 flex items-center justify-end cursor-pointer hover:underline"
        onClick={() => setOpen(true)}
      >
        <div className="mr-2">Schedule Today</div>
        <IoArrowForward />
      </div>
      <Modal open={open} closeCallback={() => setOpen(false)}>
        {state.step === 1 && (
          <ScheduleFlowStep1 value={state.budget} {...childProps} />
        )}
        {state.step === 2 && <ScheduleFlowStep2 {...childProps} />}
        {state.step === 3 && <ScheduleFlowStep3 {...childProps} {...props} />}
      </Modal>
    </>
  );
}
