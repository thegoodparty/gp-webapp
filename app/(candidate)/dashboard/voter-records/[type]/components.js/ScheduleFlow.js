'use client';

import Modal from '@shared/utils/Modal';
import { useState, useMemo } from 'react';
import { IoArrowForward } from 'react-icons/io5';
import ScheduleFlowStep0 from './ScheduleFlowStep0';
import ScheduleFlowStep1 from './ScheduleFlowStep1';
import ScheduleFlowStep2 from './ScheduleFlowStep2';
import ScheduleFlowStep3 from './ScheduleFlowStep3';
import ScheduleFlowStep4 from './ScheduleFlowStep4';
import ScheduleFlowStep5 from './ScheduleFlowStep5';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import queryString from 'query-string';
import { buildTrackingAttrs } from 'helpers/fullStoryHelper';

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

/**
 * @typedef {Object} ScheduleFlowProps
 * @property {string} type
 * @property {React.ReactElement} customButton Pass a custom element to use instead of "Schedule Today" link
 * @property {Object} campaign
 * @property {boolean} isCustom
 * @property {string} fileName
 */

/**
 * @param {ScheduleFlowProps} props
 */
export default function ScheduleFlow({
  type,
  customButton,
  campaign,
  isCustom,
  fileName,
}) {
  const startingStep = type === 'sms' ? 0 : 1;
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    step: startingStep,
    budget: false,
    voicemail: undefined,
    audience: {},
    script: false,
  });

  const trackingAttrs = useMemo(
    () => buildTrackingAttrs('Schedule Contact Campaign Link', { type }),
    [type],
  );

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
      step: startingStep,
      budget: 0,
      audience: {},
      script: false,
    });
  };

  const handleSubmit = async () => {
    const activeFilters = Object.keys(state.audience).filter(
      (key) => state.audience[key] === true,
    );
    const customFilters = {
      filters: activeFilters,
    };

    const customFiltersEncoded = queryString.stringify({
      customFilters: JSON.stringify(customFilters),
    });

    // If queryString handles the type, it appends it to the end instead of the beginning
    const voterFileUrl = `${gpApi.voterData.getVoterFile.url}?type=${type}&${customFiltersEncoded}`;

    console.log('BOUT TO SUBMIT', activeFilters, customFilters, voterFileUrl);

    const updatedState = {
      ...state,
      voterFileUrl,
      type,
    };
    await scheduleCampaign(updatedState);
  };

  const callbackProps = {
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
        className="cursor-pointer hover:underline"
        onClick={() => setOpen(true)}
        {...trackingAttrs}
      >
        {customButton ? (
          customButton
        ) : (
          <span className="mt-4 flex items-center justify-end">
            <span className="mr-2">Schedule Today</span>
            <IoArrowForward />
          </span>
        )}
      </div>
      <Modal open={open} closeCallback={handleClose}>
        {state.step === 0 && (
          <ScheduleFlowStep0 type={type} {...callbackProps} />
        )}
        {state.step === 1 && (
          <ScheduleFlowStep1
            type={type}
            value={state.budget}
            voicemailValue={state.voicemail}
            {...callbackProps}
          />
        )}
        {state.step === 2 && (
          <ScheduleFlowStep2
            type={type}
            withVoicemail={!!state.voicemail}
            audience={state.audience}
            isCustom={isCustom}
            {...callbackProps}
          />
        )}
        {state.step === 3 && (
          <ScheduleFlowStep3
            campaign={campaign}
            script={state.script}
            {...callbackProps}
          />
        )}
        {state.step === 4 && (
          <ScheduleFlowStep4
            type={type}
            fileName={fileName}
            {...callbackProps}
          />
        )}
        {state.step === 5 && <ScheduleFlowStep5 {...callbackProps} />}
      </Modal>
    </>
  );
}
