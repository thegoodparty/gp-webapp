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
import { isObjectEqual } from 'helpers/objectHelper'
import { STEPS, TASK_TYPES } from '../../../shared/constants/tasks.const'
import sanitizeHtml from 'sanitize-html'
import { useOutreach } from 'app/(candidate)/dashboard/outreach/hooks/OutreachContext'
import { useSnackbar } from 'helpers/useSnackbar'
import { getVoterContactField } from '@shared/hooks/VoterContactsProvider'
import { useVoterContacts } from '@shared/hooks/useVoterContacts'
import { useCampaign } from '@shared/hooks/useCampaign'
import {
  handleCreateOutreach,
  handleCreatePhoneList,
  handleCreateVoterFileFilter,
  handleScheduleOutreach,
} from 'app/(candidate)/dashboard/components/tasks/flows/util/flowHandlers.util'
import { OUTREACH_OPTIONS } from 'app/(candidate)/dashboard/outreach/components/OutreachCreateCards'
import { PurchaseIntentProvider } from 'app/(candidate)/dashboard/purchase/components/PurchaseIntentProvider'
import { PURCHASE_TYPES } from 'helpers/purchaseTypes'
import { dollarsToCents } from 'helpers/numberHelper'
import { PurchaseStep } from 'app/(candidate)/dashboard/components/tasks/flows/PurchaseStep'
import { noop } from '@shared/utils/noop'
import { LongPoll } from '@shared/utils/LongPoll'
import { getP2pPhoneListStatus } from 'helpers/createP2pPhoneList'
import { getFlowStepsByType } from 'app/(candidate)/dashboard/components/tasks/flows/util/getFlowStepsByType.util'
import { useP2pUxEnabled } from 'app/(candidate)/dashboard/components/tasks/flows/hooks/P2pUxEnabledProvider'

const DEFAULT_STATE = {
  step: 0,
  budget: 0,
  voicemail: undefined,
  audience: {},
  script: false,
  scriptText: '',
  image: undefined,
  voterCount: 0,
  voterFileFilter: null,
  phoneListToken: '',
  phoneListId: null,
  leadsLoaded: null,
}

/**
 * @typedef {Object} TaskFlowProps
 * @property {string} type
 * @property {React.ReactElement} [customButton] Pass a custom element to use instead of "Schedule Today" link
 * @property {Object} campaign
 * @property {boolean} isCustom
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
  onClose,
  defaultAiTemplateId,
}) {
  const { p2pUxEnabled } = useP2pUxEnabled()
  const [open, setOpen] = useState(forceOpen)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [state, setState] = useState(DEFAULT_STATE)
  const stepList = useMemo(getFlowStepsByType(type, p2pUxEnabled), [
    type,
    p2pUxEnabled,
  ])
  const stepName = stepList[state.step]
  const isLastStep = state.step >= stepList.length - 1
  const [outreaches, setOutreaches] = useOutreach()
  const { errorSnackbar, successSnackbar } = useSnackbar()
  const [, updateVoterContacts] = useVoterContacts()
  const [, , refreshCampaign] = useCampaign()
  const outreachOption = OUTREACH_OPTIONS.find(
    (outreach) => outreach.type === type,
  )
  const { phoneListToken, phoneListId, leadsLoaded } = state
  const [stopPolling, setStopPolling] = useState(false)

  const purchaseMetaData = {
    contactCount: leadsLoaded,
    pricePerContact: dollarsToCents(outreachOption?.cost || 0) || 0,
    outreachType: type,
    campaignId: campaign.id,
  }

  const trackingAttrs = useMemo(
    () => buildTrackingAttrs('Schedule Contact Campaign Link', { type }),
    [type],
  )

  const handleChange = (changeSetOrKey, value) => {
    if (typeof changeSetOrKey === 'object') {
      setState((prevState) => ({
        ...prevState,
        ...changeSetOrKey,
      }))
    } else {
      setState((prevState) => ({
        ...prevState,
        [changeSetOrKey]: value,
      }))
    }
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
    if (type !== TASK_TYPES.robocall) {
      trackEvent(EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Exit, {
        step: stepName,
      })
    }
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
    if (type !== TASK_TYPES.robocall) {
      trackEvent(EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Next, {
        step: stepName,
      })
    }
    setState((prevState) => ({
      ...prevState,
      step: state.step + 1,
    }))
  }

  const handleBack = () => {
    if (state.step <= 0) return
    if (type !== TASK_TYPES.robocall) {
      trackEvent(EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Back, {
        step: stepName,
      })
    }
    setState({
      ...state,
      step: state.step - 1,
    })
  }

  const handleReset = () => {
    setState(DEFAULT_STATE)
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
    resetCallback: handleReset,
  }

  const onCreateOutreach = useMemo(
    () =>
      handleCreateOutreach({
        type,
        state,
        campaignId: campaign.id,
        outreaches,
        setOutreaches,
        errorSnackbar,
        refreshCampaign,
        p2pUxEnabled,
      }),
    [
      type,
      state,
      campaign,
      outreaches,
      setOutreaches,
      errorSnackbar,
      refreshCampaign,
      p2pUxEnabled,
    ],
  )

  const onCreateVoterFileFilter = useMemo(
    () =>
      handleCreateVoterFileFilter({
        type,
        state,
        errorSnackbar,
      }),
    [type, state, errorSnackbar],
  )

  const onCreatePhoneList = useMemo(
    () => handleCreatePhoneList(errorSnackbar),
    [errorSnackbar],
  )

  const handlePurchaseComplete = async () => {
    await handleScheduleOutreach(
      type,
      errorSnackbar,
      successSnackbar,
      state,
    )(await onCreateOutreach())

    const contactField = getVoterContactField(type)
    await updateVoterContacts((currentContacts) => ({
      ...currentContacts,
      [contactField]:
        (currentContacts[contactField] || 0) + (state.voterCount || 0),
    }))

    handleNext()
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
        {p2pUxEnabled && phoneListToken && (
          <LongPoll
            {...{
              pollingMethod: async () => {
                return await getP2pPhoneListStatus(phoneListToken)
              },
              onSuccess: (result) => {
                const { phoneListId, leadsLoaded } = result || {}
                handleChange({
                  phoneListId,
                  leadsLoaded,
                })
                setStopPolling(true)
              },
              stopPolling,
              limit: 60,
            }}
          />
        )}
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
            onCreateVoterFileFilter={onCreateVoterFileFilter}
            onCreatePhoneList={onCreatePhoneList}
          />
        )}
        {stepName === STEPS.script && (
          <AddScriptStep
            {...{
              type,
              campaign,
              onComplete: handleAddScriptOnComplete,
              defaultAiTemplateId,
              ...callbackProps,
            }}
          />
        )}
        {stepName === STEPS.image && (
          <ImageStep type={type} image={state.image} {...callbackProps} />
        )}
        {stepName === STEPS.schedule && (
          <ScheduleStep
            schedule={state.schedule}
            type={type}
            {...callbackProps}
            // Only call onCreateOutreach if we're on the last step, otherwise
            // we'll call it in the last step
            onCreateOutreach={isLastStep ? onCreateOutreach : noop}
            onScheduleOutreach={
              isLastStep
                ? handleScheduleOutreach(
                    type,
                    errorSnackbar,
                    successSnackbar,
                    state,
                  )
                : noop
            }
            isLastStep
          />
        )}
        {stepName === STEPS.purchase && (
          <PurchaseIntentProvider
            {...{
              type: PURCHASE_TYPES.TEXT,
              purchaseMetaData,
            }}
          >
            <PurchaseStep
              {...{
                onComplete: handlePurchaseComplete,
                phoneListId,
                contactCount: purchaseMetaData?.contactCount,
                type,
                pricePerContact: purchaseMetaData?.pricePerContact,
              }}
            />
          </PurchaseIntentProvider>
        )}
        {stepName === STEPS.download && (
          <DownloadStep
            {...{
              type,
              scriptText: state.scriptText,
              audience: state.audience,
              ...callbackProps,
              onCreateOutreach,
              voterCount: state.voterCount,
            }}
          />
        )}
        {stepName === STEPS.socialPost && (
          <SocialPostStep
            scriptText={state.scriptText}
            {...callbackProps}
            onCreateOutreach={onCreateOutreach}
          />
        )}
      </Modal>
    </>
  )
}
