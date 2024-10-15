'use client';
import Modal from '@shared/utils/Modal';
import { useState, useMemo } from 'react';
import { IoArrowForward } from 'react-icons/io5';
import ScheduleFlowStep1 from './ScheduleFlowStep1';
import ScheduleFlowStep2 from './ScheduleFlowStep2';
import ScheduleAddScriptFlow from 'app/(candidate)/dashboard/voter-records/[type]/components.js/ScheduleAddScriptFlow/ScheduleAddScriptFlow';
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

export default function ScheduleFlow(props) {
  const { type, customButton } = props;

  // TODO: Set defaults back to what they should be for `open` and `state.step`
  const [open, setOpen] = useState(true);
  const [state, setState] = useState({
    step: 3,
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
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleClose = () => {
    setOpen(false);
    handleReset();
  };
  const handleNext = () => {
    setState((prevState) => ({
      ...prevState,
      step: state.step + 1,
    }));
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
      audience: {},
      script: false,
    });
  };

  const handleSubmit = async () => {
    const activeFilters = Object.keys(state.audience).filter(
      (key) => state.audience[key],
    );
    const customFilters = {
      filters: activeFilters,
    };

    const customFiltersEncoded = queryString.stringify({
      customFilters: JSON.stringify(customFilters),
    });

    // If queryString handles the type, it appends it to the end instead of the beginning
    const voterFileUrl = `${gpApi.voterData.getVoterFile.url}?type=${type}&${customFiltersEncoded}`;

    const updatedState = {
      ...state,
      voterFileUrl,
      type,
    };
    await scheduleCampaign(updatedState);
  };

  const handleAddScriptOnComplete = (scriptKeyOrText) => {
    handleChange('script', scriptKeyOrText);
    handleNext();
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
            audience={state.audience}
          />
        )}
        {state.step === 3 && (
          <ScheduleAddScriptFlow
            {...childProps}
            {...props}
            onComplete={handleAddScriptOnComplete}
          />
        )}
        {state.step === 4 && <ScheduleFlowStep4 {...childProps} {...props} />}
        {state.step === 5 && <ScheduleFlowStep5 {...childProps} {...props} />}
      </Modal>
    </>
  );
}
