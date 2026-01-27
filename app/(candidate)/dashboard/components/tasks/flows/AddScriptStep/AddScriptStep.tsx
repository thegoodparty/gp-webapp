'use client'
import { useEffect, useState } from 'react'
import { ChooseScriptAddFlow } from './ChooseScriptAddFlow'
import { ADD_SCRIPT_FLOW } from './AddScriptFlow.const'
import { SelectScriptScreen } from 'app/(candidate)/dashboard/components/tasks/flows/AddScriptStep/SelectScriptScreen'
import { CreateSmSScriptScreen } from './CreateSmSScriptScreen'
import { getSmsScriptSelectOptions } from './SmsScriptSelect'
import {
  fetchAiContentCategories,
  SelectAiTemplateScreen,
} from 'app/(candidate)/dashboard/components/tasks/flows/AddScriptStep/SelectAiTemplateScreen'
import { GenerateLoadingScreen } from './GenerateLoadingScreen'
import { GenerateReviewScreen } from './GenerateReviewScreen'
import { Campaign } from 'helpers/types'

type ContentCategoryList = Awaited<
  ReturnType<typeof fetchAiContentCategories>
>

type AddScriptStepProps = {
  type?: string
  onComplete?: (scriptKey: string | null, scriptContent?: string) => void
  backCallback: () => void
  campaign: Campaign
  defaultAiTemplateId?: number | string
}

const AddScriptStep = ({
  type,
  onComplete = () => {},
  backCallback,
  campaign,
  defaultAiTemplateId,
}: AddScriptStepProps): React.JSX.Element => {
  const [currentScreen, setCurrentScreen] = useState<string | undefined>(
    ADD_SCRIPT_FLOW.CHOOSE_FLOW,
  )
  const [aiTemplateKey, setAiTemplateKey] = useState('')
  const [aiScriptKey, setAiScriptKey] = useState<string | null>('')
  const [contentCategories, setContentCategories] =
    useState<ContentCategoryList>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await fetchAiContentCategories(campaign)
      setContentCategories(categories)

      if (defaultAiTemplateId) {
        const template = categories!
          .flatMap((category) => category.templates || [])
          .find((template) => template.id === defaultAiTemplateId)

        setAiTemplateKey(template ? template.key : '')
      } else {
        setAiTemplateKey('')
      }
    }
    fetchCategories()
  }, [campaign, defaultAiTemplateId])

  const onBack = (screen?: string) => {
    if (!screen) return backCallback()
    setCurrentScreen(screen)
  }

  const onNext = (screen?: string) => {
    if (screen === ADD_SCRIPT_FLOW.SELECT_SMS_AI_TEMPLATE && aiTemplateKey) {
      setCurrentScreen(ADD_SCRIPT_FLOW.GENERATE_LOADING)
    } else {
      setCurrentScreen(screen)
    }
  }

  const hasSavedScripts =
    getSmsScriptSelectOptions(campaign?.aiContent).length > 0

  const Screens = {
    [ADD_SCRIPT_FLOW.CHOOSE_FLOW]: (
      <ChooseScriptAddFlow
        onBack={() => onBack()}
        onNext={onNext}
        hasSavedScripts={hasSavedScripts}
      />
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
            onBack(ADD_SCRIPT_FLOW.SELECT_SMS_AI_TEMPLATE),
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

  return (
    <div className="p-4 w-[80vw] max-w-xl">{Screens[currentScreen!]}</div>
  )
}

export default AddScriptStep
