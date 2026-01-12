'use client'
import { useEffect, useState } from 'react'
import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import { ModalFooter } from '@shared/ModalFooter'
import {
  getCampaign,
  updateCampaign,
} from 'app/(candidate)/onboarding/shared/ajaxActions'
import { useSnackbar } from 'helpers/useSnackbar'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { TASK_TYPES } from '../../../../shared/constants/tasks.const'
import dynamic from 'next/dynamic'

const RichEditor = dynamic(() => import('app/shared/utils/RichEditor'), {
  ssr: false,
  loading: () => (
    <p className="p-4 text-center text-2xl font-bold">Loading Editor...</p>
  ),
})

export const GenerateReviewScreen = ({
  aiScriptKey = '',
  onBack = () => {},
  onNext = (scriptKey, scriptContent) => {},
  flowType,
  scriptSource = 'generated', // 'saved' or 'generated'
}) => {
  const { errorSnackbar } = useSnackbar()
  const [aiContent, setAiContent] = useState({})
  const [scriptContent, setScriptContent] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchAiContent = async () => {
      try {
        const campaign = await getCampaign()
        const { aiContent } = campaign || {}
        if (!aiContent?.[aiScriptKey]) {
          throw new Error(`No aiScriptKey AI content found => ${aiScriptKey}`)
        }
        setAiContent(aiContent[aiScriptKey])
        setScriptContent(aiContent[aiScriptKey]?.content || '')
      } catch (e) {
        console.error('error fetching aiContent for review => ', e)
        errorSnackbar('Error fetching AI-generated content')
      }
    }
    fetchAiContent()
  }, [])

  const handleOnNext = async () => {
    setSaving(true)
    try {
      await updateCampaign([
        {
          key: `aiContent.${aiScriptKey}`,
          value: { ...aiContent, content: scriptContent },
        },
      ])

      if (flowType === TASK_TYPES.robocall) {
        const scriptType =
          scriptSource === 'saved' ? 'savedScript' : 'generatedScript'
        trackEvent(
          EVENTS.Dashboard.VoterContact.Robocall.ScheduleCampaign.Script
            .SubmitScript,
          { scriptType },
        )
      }

      onNext(aiScriptKey, scriptContent)
    } catch (e) {
      console.error('Error updating campaign with AI content => ', e)
      errorSnackbar('Error saving AI-generated content')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <header className="text-center">
        <H1>Review script</H1>
        <Body1 className="mt-4 mb-8">
          Click in the editor to make any necessary changes.
        </Body1>
      </header>
      <section>
        <RichEditor
          initialText={aiContent.content}
          onChangeCallback={(content) => {
            setScriptContent(content)
          }}
          useOnChange
        />
      </section>
      <ModalFooter
        onBack={onBack}
        onNext={handleOnNext}
        disabled={!scriptContent || saving}
        nextText="Save"
        nextButtonProps={{
          loading: saving,
        }}
      />
    </>
  )
}
