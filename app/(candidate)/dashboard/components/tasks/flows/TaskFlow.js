'use client'
import Modal from '@shared/utils/Modal'
import { useMemo, useState } from 'react'
import { IoArrowForward } from 'react-icons/io5'
import InstructionsStep from './InstructionsStep'
import AudienceStep from './AudienceStep'
import AddScriptStep from './AddScriptStep/AddScriptStep'
import ScheduleStep from './ScheduleStep'
import ImageStep from './ImageStep'
import DownloadStep from './DownloadStep'
import SocialPostStep from './SocialPostStep'
import CloseConfirmModal from './CloseConfirmModal'
import { buildTrackingAttrs, EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { scheduleVoterMessagingCampaign } from 'helpers/scheduleVoterMessagingCampaign'
import { isObjectEqual } from 'helpers/objectHelper'
import { STEPS, STEPS_BY_TYPE } from '../../../shared/constants/tasks.const'
import sanitizeHtml from 'sanitize-html'
import { useOutreach } from 'app/(candidate)/dashboard/outreach/hooks/OutreachContext'

const DEFAULT_STATE = {
  step: 0,
  budget: 0,
  voicemail: undefined,
  audience: {},
  script: false,
  scriptText: '',
  image: undefined,
  voterCount: 0,
}

/**
 * @typedef {Object} TaskFlowProps
 * @property {string} type
 * @property {React.ReactElement} customButton Pass a custom element to use instead of "Schedule Today" link
 * @property {Object} campaign
 * @property {boolean} isCustom
 * @property {string} fileName
 */

/**
 * @param {TaskFlowProps} props
 */
export default function TaskFlow({
  forceOpen = false,
  type,
  customButton,
  campaign,
  isCustom,
  fileName,
  onClose,
  defaultAiTemplateId,
}) {
  const [open, setOpen] = useState(forceOpen)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [state, setState] = useState(DEFAULT_STATE)
  const stepList = useMemo(() => STEPS_BY_TYPE[type], [type])
  const stepName = stepList[state.step]
  const isLastStep = state.step >= stepList.length - 1
  const [outreaches, setOutreaches] = useOutreach()
  const trackingAttrs = useMemo(
    () => buildTrackingAttrs('Schedule Contact Campaign Link', { type }),
    [type],
  )

  console.log(`outreaches =>`, outreaches)

  const handleChange = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }

  const handleClose = () => {
    if (isObjectEqual(state, DEFAULT_STATE) || isLastStep) {
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
    onClose?.()
  }

  const handleNext = () => {
    if (isLastStep) {
      handleCloseConfirm()
      return
    }
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
    const result = await scheduleVoterMessagingCampaign(updatedState)
    if (!(result?.ok === false || result?.error)) {
      setOutreaches([...outreaches, result])
    }
    return result
  }

  const handleAddScriptOnComplete = (scriptKeyOrText, scriptContent) => {
    handleChange('script', scriptKeyOrText)

    const content =
      scriptContent ?? campaign.aiContent?.[scriptKeyOrText]?.content
    const scriptText = content
      ? sanitizeHtml(content, {
          allowedTags: [],
          allowedAttributes: {},
        })
      : scriptKeyOrText

    handleChange('scriptText', scriptText)
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
        type={type}
        onCancel={handleCloseCancel}
        onConfirm={handleCloseConfirm}
      />
      <Modal open={open} closeCallback={handleClose}>
        {stepName === STEPS.intro && (
          <InstructionsStep type={type} {...callbackProps} />
        )}

        {stepName === STEPS.audience && (
          <AudienceStep
            type={type}
            withVoicemail={!!state.voicemail}
            audience={state.audience}
            isCustom={isCustom}
            {...callbackProps}
          />
        )}
        {stepName === STEPS.script && (
          <AddScriptStep
            campaign={campaign}
            onComplete={handleAddScriptOnComplete}
            defaultAiTemplateId={defaultAiTemplateId}
            {...callbackProps}
          />
        )}
        {stepName === STEPS.image && (
          <ImageStep type={type} image={state.image} {...callbackProps} />
        )}
        {stepName === STEPS.schedule && (
          <ScheduleStep
            schedule={state.schedule}
            type={type}
            fileName={fileName}
            {...callbackProps}
          />
        )}
        {stepName === STEPS.download && (
          <DownloadStep
            type={type}
            scriptText={state.scriptText}
            audience={state.audience}
            {...callbackProps}
          />
        )}
        {stepName === STEPS.socialPost && (
          <SocialPostStep
            type={type}
            scriptText={state.scriptText}
            {...callbackProps}
          />
        )}
      </Modal>
    </>
  )
}
