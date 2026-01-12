'use client'
import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import RadioList from '@shared/inputs/RadioList'
import { ModalFooter } from '@shared/ModalFooter'
import { ADD_SCRIPT_FLOW } from './AddScriptFlow.const'
import { useState } from 'react'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { TASK_TYPES } from '../../../../shared/constants/tasks.const'

const getScriptTypeForTracking = (selectedFlow: string | undefined): string => {
  switch (selectedFlow) {
    case ADD_SCRIPT_FLOW.SELECT_SMS:
      return 'savedScript'
    case ADD_SCRIPT_FLOW.SELECT_SMS_AI_TEMPLATE:
      return 'generatedScript'
    case ADD_SCRIPT_FLOW.CREATE_SMS:
      return 'newScript'
    default:
      return 'unknown'
  }
}

interface ChooseScriptAddFlowProps {
  onBack?: () => void
  onNext?: (choiceKey: string | undefined) => void
  hasSavedScripts?: boolean
  flowType?: string
}

export const ChooseScriptAddFlow = ({
  onBack = () => {},
  onNext = () => {},
  hasSavedScripts = false,
  flowType,
}: ChooseScriptAddFlowProps): React.JSX.Element => {
  const [selected, setSelected] = useState<string>()
  const handleOnNext = () => {
    if (flowType === TASK_TYPES.robocall) {
      trackEvent(
        EVENTS.Dashboard.VoterContact.Robocall.ScheduleCampaign.Script.AddScript,
        {
          scriptType: getScriptTypeForTracking(selected),
        },
      )
    }
    onNext(selected)
  }

  const handleSelect = (key: string) => {
    setSelected(key)

    // Only track text campaign click events for non-robocall flows
    if (flowType !== TASK_TYPES.robocall) {
      let eventName
      if (key === ADD_SCRIPT_FLOW.SELECT_SMS) {
        eventName =
          EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Script
            .ClickSaved
      } else if (key === ADD_SCRIPT_FLOW.SELECT_SMS_AI_TEMPLATE) {
        eventName =
          EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Script
            .ClickGenerate
      } else {
        eventName =
          EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Script.ClickAdd
      }
      trackEvent(eventName)
    }
  }

  const options = [
    ...(hasSavedScripts
      ? [
          {
            key: ADD_SCRIPT_FLOW.SELECT_SMS,
            value: 'Select a saved script',
            label: 'Select a saved script',
          },
        ]
      : []),
    {
      key: ADD_SCRIPT_FLOW.SELECT_SMS_AI_TEMPLATE,
      value: 'Generate a new script',
      label: 'Generate a new script',
    },
    {
      key: ADD_SCRIPT_FLOW.CREATE_SMS,
      value: 'Create a new script',
      label: 'Create a new script',
    },
  ]
  return (
    <>
      <header className="text-center">
        <H1>Add a script</H1>
        <Body1 className="mt-4 mb-8">Choose an option</Body1>
      </header>
      <div className="mt-6">
        <RadioList
          options={options}
          selectCallback={handleSelect}
          selected={selected || ''}
        />
      </div>
      <ModalFooter onBack={onBack} onNext={handleOnNext} disabled={!selected} />
    </>
  )
}
