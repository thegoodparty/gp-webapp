'use client'
import Modal from '@shared/utils/Modal'
import { useMemo, useState } from 'react'
import { IoArrowForward } from 'react-icons/io5'
import ScheduleFlowInstructions from './ScheduleFlowInstructions'
import ScheduleFlowBudgetStep from './ScheduleFlowBudgetStep'
import ScheduleFlowAudienceStep from './ScheduleFlowAudienceStep'
import ScheduleAddScriptFlow from 'app/(candidate)/dashboard/voter-records/[type]/components/ScheduleAddScriptFlow/ScheduleAddScriptFlow'
import ScheduleFlowScheduleStep from './ScheduleFlowScheduleStep'
import ScheduleFlowComplete from './ScheduleFlowComplete'
import ScheduleFlowImageStep from './ScheduleFlowImageStep'
import CloseConfirmModal from './CloseConfirmModal'
import {
  buildTrackingAttrs,
  EVENTS,
  trackEvent,
} from 'helpers/fullStoryHelper'
import { scheduleVoterMessagingCampaign } from 'helpers/scheduleVoterMessagingCampaign'
import { isObjectEqual } from 'helpers/objectHelper'

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
}

const DEFAULT_STATE = {
  step: 0,
  budget: false,
  voicemail: undefined,
  audience: {},
  script: false,
  image: undefined,
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
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [state, setState] = useState(DEFAULT_STATE)
  const stepList = useMemo(() => STEPS_BY_TYPE[type], [type])
  const stepName = stepList[state.step]

  const trackingAttrs = useMemo(
    () => buildTrackingAttrs('Schedule Contact Campaign Link', { type }),
    [type],
  )

  const handleChange = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }

  const handleClose = () => {
    if (isObjectEqual(state, DEFAULT_STATE) || stepName === 'complete') {
      handleCloseConfirm()
      return
    }

    setConfirmOpen(true)
  }

  const handleCloseCancel = () => {
    setConfirmOpen(false)
  }

  const handleCloseConfirm = () => {
    trackEvent(EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Exit, {
      step: stepName,
    })
    setConfirmOpen(false)
    setOpen(false)
    handleReset()
  }

  const handleNext = () => {
    if (state.step >= stepList.length - 1) return
    trackEvent(EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Next, {
      step: stepName,
    })
    setState((prevState) => ({
      ...prevState,
      step: state.step + 1,
    }))
  }

  const handleBack = () => {
    if (state.step <= 0) return
    trackEvent(EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Back, {
      step: stepName,
    })
    setState({
      ...state,
      step: state.step - 1,
    })
  }

  const handleReset = () => {
    setState(DEFAULT_STATE)
  }

  const handleSubmit = async () => {
    trackEvent(EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Submit)
    const updatedState = {
      ...state,
      type,
    }
    return await scheduleVoterMessagingCampaign(updatedState)
  }

  const handleAddScriptOnComplete = (scriptKeyOrText) => {
    handleChange('script', scriptKeyOrText)
    handleNext()
  }

  const callbackProps = {
    onChangeCallback: handleChange,
    closeCallback: handleClose,
    nextCallback: handleNext,
    backCallback: handleBack,
    submitCallback: handleSubmit,
    resetCallback: handleReset,
  }

  return (
    <>
      <div
        className="cursor-pointer hover:underline"
        onClick={() => setOpen(true)}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
        {...trackingAttrs}
      >
        {customButton ? (
          customButton
        ) : (
          <span
            role="button"
            tabIndex={0}
            className="mt-4 flex items-center justify-end"
            onClick={() => {
              // NOTE: this text link form is only used on the Voter File Detail page
              trackEvent(
                EVENTS.VoterData.FileDetail.LearnTakeAction.ClickSchedule,
                { type },
              )
            }}
          >
            <span className="mr-2">Schedule Today</span>
            <IoArrowForward />
          </span>
        )}
      </div>
      <CloseConfirmModal
        open={confirmOpen}
        onCancel={handleCloseCancel}
        onConfirm={handleCloseConfirm}
      />
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
  )
}
