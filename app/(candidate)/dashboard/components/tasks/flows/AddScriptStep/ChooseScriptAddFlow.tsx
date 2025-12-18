'use client'
import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import RadioList from '@shared/inputs/RadioList'
import { ModalFooter } from '@shared/ModalFooter'
import { ADD_SCRIPT_FLOW } from './AddScriptFlow.const'
import { useState } from 'react'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'

interface ChooseScriptAddFlowProps {
  onBack?: () => void
  onNext?: (choiceKey: string | undefined) => void
}

export const ChooseScriptAddFlow = ({
  onBack = () => {},
  onNext = () => {},
}: ChooseScriptAddFlowProps): React.JSX.Element => {
  const [selected, setSelected] = useState<string>()
  const handleOnNext = () => {
    onNext(selected)
  }

  const handleSelect = (key: string) => {
    setSelected(key)

    let eventName
    if (key === ADD_SCRIPT_FLOW.SELECT_SMS) {
      eventName =
        EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Script.ClickSaved
    } else {
      eventName =
        EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Script.ClickAdd
    }
    trackEvent(eventName)
  }

  const options = [
    {
      key: ADD_SCRIPT_FLOW.SELECT_SMS,
      value: 'Select a saved script',
      label: 'Select a saved script',
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
