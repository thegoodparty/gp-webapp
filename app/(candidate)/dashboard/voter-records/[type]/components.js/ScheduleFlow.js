'use client';

import Modal from '@shared/utils/Modal';
import { useState } from 'react';
import { IoArrowForward } from 'react-icons/io5';
import ScheduleFlowStep1 from './ScheduleFlowStep1';
import ScheduleFlowStep2 from './ScheduleFlowStep2';
import ScheduleFlowStep3 from './ScheduleFlowStep3';
import ScheduleFlowStep4 from './ScheduleFlowStep4';
import ScheduleFlowStep5 from './ScheduleFlowStep5';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';

export async function scheduleCampaign(state) {
  try {
    const api = gpApi.voterData.schedule;
    const payload = {
      ...state,
      date: state.schedule?.date,
      message: state.schedule?.message,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

export default function ScheduleFlow(props) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    step: 1,
    budget: false,
    voicemail: undefined,
  });

  const handleChange = (key, value) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  const handleClose = () => {
    setOpen(false);
    handleReset();
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

  const handleReset = () => {
    setState({
      step: 1,
      budget: 0,
    });
  };

  const handleSubmit = async () => {
    await scheduleCampaign(state);
  };

  const childProps = {
    onChangeCallback: handleChange,
    closeCallback: handleClose,
    nextCallback: handleNext,
    backCallback: handleBack,
    submitCallback: handleSubmit,
    resetCallback: handleReset,
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
          <ScheduleFlowStep1
            value={state.budget}
            voicemailValue={state.voicemail}
            {...childProps}
            {...props}
          />
        )}
        {state.step === 2 && (
          <ScheduleFlowStep2
            {...childProps}
            {...props}
            withVoicemail={!!state.voicemail}
          />
        )}
        {state.step === 3 && <ScheduleFlowStep3 {...childProps} {...props} />}
        {state.step === 4 && <ScheduleFlowStep4 {...childProps} {...props} />}
        {state.step === 5 && <ScheduleFlowStep5 {...childProps} {...props} />}
      </Modal>
    </>
  );
}
