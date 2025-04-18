'use client'
import { useState } from 'react'
import { ChooseScriptAddFlow } from './ChooseScriptAddFlow'
import { ADD_SCRIPT_FLOW } from './AddScriptFlow.const'
import { SelectSmSScriptScreen } from './SelectSmSScriptScreen'
import { CreateSmSScriptScreen } from './CreateSmSScriptScreen'
import { SelectSmsAiTemplateScreen } from './SelectSmsAiTemplateScreen'
import { GenerateLoadingScreen } from './GenerateLoadingScreen'
import { GenerateReviewScreen } from './GenerateReviewScreen'

export default function AddScriptStep({
  onComplete = (scriptKey, scriptContent) => {},
  backCallback,
  campaign,
  defaultAiTemplateId,
}) {
  const [currentScreen, setCurrentScreen] = useState(
    ADD_SCRIPT_FLOW.CHOOSE_FLOW,
  )
  const [aiTemplateKey, setAiTemplateKey] = useState('')
  const [aiScriptKey, setAiScriptKey] = useState('')

  const onBack = (screen) => {
    if (!screen) return backCallback()
    setCurrentScreen(screen)
  }

  const onNext = (screen) => {
    setCurrentScreen(screen)
  }

  const Screens = {
    [ADD_SCRIPT_FLOW.CHOOSE_FLOW]: (
      <ChooseScriptAddFlow onBack={() => onBack()} onNext={onNext} />
    ),
    [ADD_SCRIPT_FLOW.SELECT_SMS]: (
      <SelectSmSScriptScreen
        aiContent={campaign.aiContent}
        onBack={() => onBack(ADD_SCRIPT_FLOW.CHOOSE_FLOW)}
        onNext={(scriptKey) => {
          setAiScriptKey(scriptKey)
          onNext(ADD_SCRIPT_FLOW.GENERATE_REVIEW)
        }}
      />
    ),
    [ADD_SCRIPT_FLOW.SELECT_SMS_AI_TEMPLATE]: (
      <SelectSmsAiTemplateScreen
        defaultAiTemplateId={defaultAiTemplateId}
        onBack={() => onBack(ADD_SCRIPT_FLOW.CHOOSE_FLOW)}
        onNext={(aiTemplateKey) => {
          setAiTemplateKey(aiTemplateKey)
          onNext(ADD_SCRIPT_FLOW.GENERATE_LOADING)
        }}
        campaign={campaign}
      />
    ),
    [ADD_SCRIPT_FLOW.GENERATE_LOADING]: (
      <GenerateLoadingScreen
        {...{
          campaign,
          aiTemplateKey,
          onBack: () =>
            onBack(ADD_SCRIPT_FLOW.CHOOSE_FLOW.SELECT_SMS_AI_TEMPLATE),
          onNext: (aiScriptKey) => {
            setAiScriptKey(aiScriptKey)
            onNext(ADD_SCRIPT_FLOW.GENERATE_REVIEW)
          },
        }}
      />
    ),
    [ADD_SCRIPT_FLOW.GENERATE_REVIEW]: (
      <GenerateReviewScreen
        aiScriptKey={aiScriptKey}
        onBack={() => onBack(ADD_SCRIPT_FLOW.CHOOSE_FLOW)}
        onNext={onComplete}
      />
    ),
    [ADD_SCRIPT_FLOW.CREATE_SMS]: (
      <CreateSmSScriptScreen
        onBack={() => onBack(ADD_SCRIPT_FLOW.CHOOSE_FLOW)}
        onNext={(scriptText) => onComplete(scriptText)}
      />
    ),
  }

  return <div className="p-4 w-[80vw] max-w-xl">{Screens[currentScreen]}</div>
}
