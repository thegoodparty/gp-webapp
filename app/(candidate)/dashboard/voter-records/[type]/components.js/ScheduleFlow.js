'use client';
import Modal from '@shared/utils/Modal';
import { useState, useMemo } from 'react';
import { IoArrowForward } from 'react-icons/io5';
import ScheduleFlowInstructions from './ScheduleFlowInstructions';
import ScheduleFlowBudgetStep from './ScheduleFlowBudgetStep';
import ScheduleFlowAudienceStep from './ScheduleFlowAudienceStep';
import ScheduleAddScriptFlow from 'app/(candidate)/dashboard/voter-records/[type]/components.js/ScheduleAddScriptFlow/ScheduleAddScriptFlow';
import ScheduleFlowScheduleStep from './ScheduleFlowScheduleStep';
import ScheduleFlowComplete from './ScheduleFlowComplete';
import ScheduleFlowImageStep from './ScheduleFlowImageStep';
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
    const formData = new FormData();

    for (const key in payload) {
      let value = payload[key];
      if (key === 'image' || value == undefined) continue;
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      formData.append(key, value);
    }

    // Skipper parser wants files after all other fields
    if (payload.image) {
      formData.append('image', payload.image);
    }

    return await gpFetch(api, formData, false, undefined, true);
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

const STEPS_BY_TYPE = {
  sms: [
    'intro',
    'budget',
    'audience',
    'script',
    'image',
    'schedule',
    'complete',
  ],
  telemarketing: ['budget', 'audience', 'script', 'schedule', 'complete'],
};

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
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    step: 0,
    budget: false,
    voicemail: undefined,
    audience: {},
    script: false,
    image: undefined,
  });
  const stepList = useMemo(() => STEPS_BY_TYPE[type], [type]);
  const stepName = stepList[state.step];

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
    if (state.step >= stepList.length - 1) return;
    setState((prevState) => ({
      ...prevState,
      step: state.step + 1,
    }));
  };

  const handleBack = () => {
    if (state.step <= 0) return;

    setState({
      ...state,
      step: state.step - 1,
    });
  };

  const handleReset = () => {
    setState({
      step: 0,
      budget: 0,
      audience: {},
      script: false,
      image: undefined,
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
        {stepName === 'intro' && (
          <ScheduleFlowInstructions type={type} {...callbackProps} />
        )}
        {stepName === 'budget' && (
          <ScheduleFlowBudgetStep
            type={type}
            value={state.budget}
            voicemailValue={state.voicemail}
            {...callbackProps}
          />
        )}
        {stepName === 'audience' && (
          <ScheduleFlowAudienceStep
            type={type}
            withVoicemail={!!state.voicemail}
            audience={state.audience}
            isCustom={isCustom}
            {...callbackProps}
          />
        )}
        {stepName === 'script' && (
          <ScheduleAddScriptFlow
            campaign={campaign}
            onComplete={handleAddScriptOnComplete}
            {...callbackProps}
          />
        )}
        {stepName === 'image' && (
          <ScheduleFlowImageStep image={state.image} {...callbackProps} />
        )}
        {stepName === 'schedule' && (
          <ScheduleFlowScheduleStep
            schedule={state.schedule}
            type={type}
            fileName={fileName}
            {...callbackProps}
          />
        )}
        {stepName === 'complete' && <ScheduleFlowComplete {...callbackProps} />}
      </Modal>
    </>
  );
}
