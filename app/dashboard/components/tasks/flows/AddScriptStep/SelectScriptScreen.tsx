import { useState } from 'react'
import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import { SmsScriptSelect } from './SmsScriptSelect'
import { ModalFooter } from '@shared/ModalFooter'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { CampaignAiContent } from 'helpers/types'

interface SelectScriptScreenProps {
  aiContent?: CampaignAiContent
  onBack?: () => void
  onNext?: (scriptKey: string | null) => void
}

export const SelectScriptScreen = ({
  aiContent,
  onBack = () => {},
  onNext = () => {},
}: SelectScriptScreenProps): React.JSX.Element => {
  const [smsScript, setSmsScript] = useState<string | null>(null)
  const handleOnNext = () => {
    trackEvent(
      EVENTS.Dashboard.VoterContact.Texting.ScheduleCampaign.Script.SelectSaved,
    )

    onNext(smsScript)
  }
  const onSelect = (key: string | null) => setSmsScript(key)
  return (
    <>
      <header className="text-center">
        <H1>Attach saved script</H1>
        <Body1 className="mt-4 mb-8">Attach your script below.</Body1>
      </header>
      <div className="mt-6">
        <SmsScriptSelect
          aiContent={aiContent}
          selectedKey={smsScript}
          onSelect={onSelect}
        />
      </div>
      <ModalFooter
        onBack={onBack}
        onNext={handleOnNext}
        disabled={!smsScript}
        nextText="Select"
      />
    </>
  )
}
