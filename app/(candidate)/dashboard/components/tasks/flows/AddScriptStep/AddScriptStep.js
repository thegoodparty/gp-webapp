'use client'
import { useEffect, useState } from 'react'
import { ChooseScriptAddFlow } from './ChooseScriptAddFlow'
import { ADD_SCRIPT_FLOW } from './AddScriptFlow.const'
import { SelectScriptScreen } from 'app/(candidate)/dashboard/components/tasks/flows/AddScriptStep/SelectScriptScreen'
import { CreateSmSScriptScreen } from './CreateSmSScriptScreen'
import {
  fetchAiContentCategories,
  SelectAiTemplateScreen,
} from 'app/(candidate)/dashboard/components/tasks/flows/AddScriptStep/SelectAiTemplateScreen'
import { GenerateLoadingScreen } from './GenerateLoadingScreen'
import { GenerateReviewScreen } from './GenerateReviewScreen'

export default function AddScriptStep({
  type,
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
  const [contentCategories, setContentCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await fetchAiContentCategories(campaign)
      setContentCategories(categories)

      if (defaultAiTemplateId) {
        const template = categories
          .flatMap((category) => category.templates)
          .find((template) => template.id === defaultAiTemplateId)

        setAiTemplateKey(template.key)
      } else {
        setAiTemplateKey('')
      }
    }
    fetchCategories()
  }, [campaign, defaultAiTemplateId])

  const onBack = (screen) => {
    if (!screen) return backCallback()
    setCurrentScreen(screen)
  }

  const onNext = (screen) => {
    if (screen === ADD_SCRIPT_FLOW.SELECT_SMS_AI_TEMPLATE && aiTemplateKey) {
      setCurrentScreen(ADD_SCRIPT_FLOW.GENERATE_LOADING)
    } else {
      setCurrentScreen(screen)
    }
  }

  const Screens = {
    [ADD_SCRIPT_FLOW.CHOOSE_FLOW]: (
      <ChooseScriptAddFlow onBack={() => onBack()} onNext={onNext} />
    ),
    [ADD_SCRIPT_FLOW.SELECT_SMS]: (
      <SelectScriptScreen
        aiContent={campaign.aiContent}
        onBack={() => onBack(ADD_SCRIPT_FLOW.CHOOSE_FLOW)}
        onNext={(scriptKey) => {
          setAiScriptKey(scriptKey)
          onNext(ADD_SCRIPT_FLOW.GENERATE_REVIEW)
        }}
      />
    ),
    [ADD_SCRIPT_FLOW.SELECT_SMS_AI_TEMPLATE]: (
      <SelectAiTemplateScreen
        flowType={type}
        onBack={() => onBack(ADD_SCRIPT_FLOW.CHOOSE_FLOW)}
        onNext={(aiTemplateKey) => {
          setAiTemplateKey(aiTemplateKey)
          onNext(ADD_SCRIPT_FLOW.GENERATE_LOADING)
        }}
        categories={contentCategories}
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
