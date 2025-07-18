'use client'
import { getAiTemplatesFromCategories } from 'helpers/getAiTemplatesFromCategories'
import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import { ModalFooter } from '@shared/ModalFooter'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SmsAiTemplateSelect } from 'app/(candidate)/dashboard/components/tasks/flows/AddScriptStep/SmsAiTemplateSelect'
import { setRequiresQuestionsOnTemplates } from 'helpers/setRequiresQuestionsOnTemplates'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { calcAnswers } from 'app/(candidate)/dashboard/shared/QuestionProgress'
import { loadCandidatePosition } from 'app/(candidate)/dashboard/campaign-details/components/issues/issuesUtils'

export async function fetchAiContentCategories(campaign, cacheTime = 3600) {
  const candidatePositions = await loadCandidatePosition(campaign.id)

  const { answeredQuestions, totalQuestions } = calcAnswers(
    campaign,
    candidatePositions,
  )

  const hasCompletedQuestions = answeredQuestions >= totalQuestions

  // TODO: Find out why in the world aren't these booleans just being passed along from the entity in Contentful.
  const requiresQuestions = !hasCompletedQuestions
    ? (
        await clientFetch(
          apiRoutes.content.getByType,
          {
            type: 'contentPromptsQuestions',
          },
          {
            revalidate: cacheTime,
          },
        )
      ).data
    : {}

  const resp = await clientFetch(
    apiRoutes.content.getByType,
    {
      type: 'aiContentCategories',
    },
    {
      revalidate: cacheTime,
    },
  )

  return resp.data.map((category = {}) => ({
    ...category,
    templates: setRequiresQuestionsOnTemplates(
      category.templates,
      requiresQuestions,
    ),
  }))
}

export const SelectAiTemplateScreen = ({
  flowType = '',
  categories,
  onBack = () => {},
  onNext = (scriptKey) => {},
}) => {
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('')
  const [templates, setTemplates] = useState([])
  const selectedTemplate = templates.find(
    ({ key }) => key === selectedTemplateKey,
  )

  useEffect(() => {
    if (categories) {
      const templates = getAiTemplatesFromCategories(categories, flowType)
      setTemplates(templates)
    }
  }, [categories])

  const handleOnNext = () => {
    onNext(selectedTemplateKey)
  }

  return (
    <>
      <header className="text-center">
        <H1>Generate a new script</H1>
        <Body1 className="mt-4 mb-8">
          Use our AI to generate the script for your text campaign. Select a
          script type below to get started.
        </Body1>
      </header>
      <section>
        <SmsAiTemplateSelect
          templates={templates}
          selected={selectedTemplateKey}
          onChange={setSelectedTemplateKey}
        />
        {Boolean(selectedTemplate?.requiresQuestions) && (
          <Body1 className="text-center mt-8">
            <Link
              className="underline text-link"
              href="/dashboard/questions?generate=all"
            >
              Finish entering your information
            </Link>{' '}
            to generate a Get Out The Vote script.
          </Body1>
        )}
      </section>
      <ModalFooter
        onBack={onBack}
        onNext={handleOnNext}
        disabled={
          !Boolean(selectedTemplate) || selectedTemplate.requiresQuestions
        }
      />
    </>
  )
}
