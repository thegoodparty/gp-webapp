'use client'
import { useEffect, useState } from 'react'
import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import { getNewAiContentSectionKey } from 'helpers/getNewAiContentSectionKey'
import {
  AI_CONTENT_SUB_SECTION_KEY,
  buildAiContentSections,
} from 'helpers/buildAiContentSections'
import GearsAnimation from '@shared/animations/GearsAnimation'
import { generateAIContent } from 'helpers/generateAIContent'
import { getCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { debounce } from 'helpers/debounceHelper'
import { useSnackbar } from 'helpers/useSnackbar'
import { useCampaign } from '@shared/hooks/useCampaign'

export const GenerateLoadingScreen = ({
  aiTemplateKey = '',
  onNext = (aiScriptKey = '') => {},
}) => {
  const [campaign, setCampaign] = useCampaign()
  const [aiContentSections] = buildAiContentSections(
    campaign,
    AI_CONTENT_SUB_SECTION_KEY,
  )
  const { errorSnackbar } = useSnackbar()
  const [generateTimeoutId, setGenerateTimeoutId] = useState(null)
  const [waiting, setWaiting] = useState(false)

  const fireError = () => {
    setGenerateTimeoutId(null)
    errorSnackbar(
      'We are experiencing an issue creating your content. Please report an issue using the Feedback bar on the right',
    )
  }

  const startTimeout = () => {
    setGenerateTimeoutId(
      setTimeout(() => {
        fireError()
      }, 1000 * 60 * 5),
    )
  }

  const generateContentPolling = async (aiScriptKey) => {
    const campaign = await getCampaign()
    const [_, jobsProcessing] = buildAiContentSections(
      campaign,
      AI_CONTENT_SUB_SECTION_KEY,
    )

    setCampaign(campaign)
    if (jobsProcessing) {
      return debounce(() => generateContentPolling(aiScriptKey), 1000 * 3)
    } else {
      clearTimeout(generateTimeoutId)
      setWaiting(false)
      onNext(aiScriptKey)
    }
  }

  useEffect(() => {
    const initiateContentGeneration = async (aiScriptKey) => {
      setWaiting(true)
      Boolean(!generateTimeoutId) && startTimeout()
      const { chatResponse, status } = await generateAIContent(aiScriptKey)

      if (status === 'processing' && !chatResponse) {
        generateContentPolling(aiScriptKey)
      } else {
        setWaiting(false)
        fireError()
      }
    }
    if (aiTemplateKey && !waiting) {
      initiateContentGeneration(
        getNewAiContentSectionKey(aiContentSections, aiTemplateKey),
      )
    }
    return () => clearTimeout(generateTimeoutId)
  }, [])

  return (
    <>
      <header className="text-center">
        <H1>Generating script</H1>
        <Body1 className="mt-4 mb-8">This may take a few minutes...</Body1>
      </header>
      <section>
        <GearsAnimation loop />
      </section>
    </>
  )
}
