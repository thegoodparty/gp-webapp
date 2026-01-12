import { useState, ChangeEvent } from 'react'
import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import TextField from '@shared/inputs/TextField'
import { ModalFooter } from '@shared/ModalFooter'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { TASK_TYPES } from '../../../../shared/constants/tasks.const'

const MAX_SMS_CHAR_COUNT = 1600

interface CreateSmSScriptScreenProps {
  onNext?: (scriptText: string) => void
  onBack?: () => void
  flowType?: string
}

export const CreateSmSScriptScreen = ({
  onNext = () => {},
  onBack = () => {},
  flowType,
}: CreateSmSScriptScreenProps): React.JSX.Element => {
  const [scriptText, setScriptText] = useState('')
  const overLimit = scriptText.length > MAX_SMS_CHAR_COUNT

  const handleOnNext = () => {
    if (flowType === TASK_TYPES.robocall) {
      trackEvent(
        EVENTS.Dashboard.VoterContact.Robocall.ScheduleCampaign.Script
          .SubmitScript,
        { scriptType: 'newScript' },
      )
    } else {
      trackEvent(
        EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Script.SubmitAdd,
      )
    }
    onNext(scriptText)
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setScriptText(e.target.value || '')
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
          slotProps={{ inputLabel: { shrink: true } }}
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
