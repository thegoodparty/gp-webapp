import { useState } from 'react'
import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import TextField from '@shared/inputs/TextField'
import { ModalFooter } from '@shared/ModalFooter'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'

const MAX_SMS_CHAR_COUNT = 1600
export const CreateSmSScriptScreen = ({
  onNext = (scriptText) => {},
  onBack = () => {},
}) => {
  const [scriptText, setScriptText] = useState('')
  const overLimit = scriptText.length > MAX_SMS_CHAR_COUNT

  const handleOnNext = () => {
    trackEvent(
      EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Script.SubmitAdd,
    )
    onNext(scriptText)
  }

  const onChange = ({ currentTarget: { value = '' } = {} } = {}) => {
    setScriptText(value)
  }

  return (
    <>
      <header className="text-center">
        <H1>Add your script</H1>
        <Body1 className="mt-4 mb-8">
          Please write or paste your script below.
        </Body1>
      </header>
      <div className="mt-6">
        <TextField
          label="Script"
          placeholder="Add your script here..."
          value={scriptText}
          onChange={onChange}
          fullWidth
          multiline
          rows={6}
          InputLabelProps={{ shrink: true }}
        />
        <div className="text-right mt-2">
          <Body1 className={overLimit ? 'text-error' : ''}>
            {scriptText.length} / {MAX_SMS_CHAR_COUNT}
          </Body1>
        </div>
      </div>
      <ModalFooter
        onBack={onBack}
        onNext={handleOnNext}
        disabled={!scriptText.length || overLimit}
      />
    </>
  )
}
