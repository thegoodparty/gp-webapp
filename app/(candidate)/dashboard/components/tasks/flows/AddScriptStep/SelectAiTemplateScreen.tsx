'use client'
import { getAiTemplatesFromCategories } from 'helpers/getAiTemplatesFromCategories'
import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import { ModalFooter } from '@shared/ModalFooter'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SmsAiTemplateSelect } from 'app/(candidate)/dashboard/components/tasks/flows/AddScriptStep/SmsAiTemplateSelect'
import {
  setRequiresQuestionsOnTemplates,
  RequiresQuestionsMap,
} from 'helpers/setRequiresQuestionsOnTemplates'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { calcAnswers } from 'app/(candidate)/dashboard/shared/QuestionProgress'
import { loadCandidatePosition } from 'app/(candidate)/dashboard/campaign-details/components/issues/issuesUtils'
import { Campaign } from 'helpers/types'
import { hasRequiredQuestions } from '../util/hasRequiredQuestions.util'

type TemplateCategoryList = NonNullable<
  Parameters<typeof getAiTemplatesFromCategories>[0]
>
type TemplateList = ReturnType<typeof getAiTemplatesFromCategories>

export const fetchAiContentCategories = async (
  campaign: Campaign,
  cacheTime: number = 3600,
): Promise<TemplateCategoryList> => {
  const candidatePositions = await loadCandidatePosition(campaign.id)
  const positions = candidatePositions === false ? null : candidatePositions

  const { answeredQuestions, totalQuestions } = calcAnswers(campaign, positions)

  const hasCompletedQuestions = answeredQuestions >= totalQuestions

  // TODO: Find out why in the world aren't these booleans just being passed along from the entity in Contentful.
  const requiresQuestions = !hasCompletedQuestions
    ? (
        await clientFetch<RequiresQuestionsMap>(
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

  const resp = await clientFetch<TemplateCategoryList>(
    apiRoutes.content.getByType,
    {
      type: 'aiContentCategories',
    },
    {
      revalidate: cacheTime,
    },
  )

  const categories = resp.data || []
  return categories.map((category) => ({
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
  onNext = () => {},
}: {
  flowType?: string
  categories?: TemplateCategoryList
  onBack?: () => void
  onNext?: (scriptKey: string) => void
}): React.JSX.Element => {
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('')
  const [templates, setTemplates] = useState<TemplateList>([])
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
          !Boolean(selectedTemplate) ||
          (selectedTemplate && Boolean(hasRequiredQuestions(selectedTemplate)))
        }
      />
    </>
  )
}
