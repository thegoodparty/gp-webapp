'use client'
import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import RadioList from '@shared/inputs/RadioList'
import { ModalFooter } from '@shared/ModalFooter'
import { ADD_SCRIPT_FLOW } from './AddScriptFlow.const'
import { useState } from 'react'
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper'

export const ChooseScriptAddFlow = ({
  onBack = () => {},
  onNext = (choiceKey = '') => {},
}) => {
  const [selected, setSelected] = useState()
  const handleOnNext = () => {
    onNext(selected)
  }

  const handleSelect = (key) => {
    setSelected(key)

    let eventName
    if (key === ADD_SCRIPT_FLOW.SELECT_SMS) {
      eventName =
        EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Script.ClickSaved
    } else if (key === ADD_SCRIPT_FLOW.SELECT_SMS_AI_TEMPLATE) {
      eventName =
        EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Script
          .ClickGenerate
    } else if (key === ADD_SCRIPT_FLOW.CREATE_SMS) {
      eventName =
        EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Script.ClickAdd
    }
    trackEvent(eventName)
  }

  return (
    <>
      <header className="text-center">
        <H1>Add a script</H1>
        <Body1 className="mt-4 mb-8">
          How would you like to add your script?
        </Body1>
      </header>
      <div className="mt-6">
        <RadioList
          options={[
            { key: ADD_SCRIPT_FLOW.SELECT_SMS, label: 'Use a saved script' },
            {
              key: ADD_SCRIPT_FLOW.SELECT_SMS_AI_TEMPLATE,
              label: 'Generate a new script',
            },
            { key: ADD_SCRIPT_FLOW.CREATE_SMS, label: 'Add your own script' },
          ]}
          selected={selected}
          selectCallback={handleSelect}
        />
      </div>
      <ModalFooter onBack={onBack} onNext={handleOnNext} disabled={!selected} />
    </>
  )
}
