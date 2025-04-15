'use client'
import H1 from '@shared/typography/H1'
import Body1 from '@shared/typography/Body1'
import { ModalFooter } from '@shared/ModalFooter'
import Button from '@shared/buttons/Button'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { AiTemplateSelect } from './AiTemplateSelect'
import { setRequiresQuestionsOnTemplates } from 'helpers/setRequiresQuestionsOnTemplates'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { calcAnswers } from 'app/(candidate)/dashboard/shared/QuestionProgress'
import { loadCandidatePosition } from 'app/(candidate)/dashboard/campaign-details/components/issues/issuesUtils'
import { CircularProgress } from '@mui/material'

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

export const SelectSmsAiTemplateScreen = ({
  campaign,
  onBack = () => {},
  onNext = (scriptKey) => {},
  defaultAiTemplateId,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('')
  const [showManualSelect, setShowManualSelect] = useState(false)

  const selectedTemplate = useMemo(
    () =>
      categories.find(({ templates }) =>
        templates.find(({ key }) => key === selectedTemplateKey),
      ),
    [categories, selectedTemplateKey],
  )

  const defaultTemplate = useMemo(() => {
    return categories
      .flatMap((category) => category.templates)
      .find((template) => template.id === defaultAiTemplateId)
  }, [categories, defaultAiTemplateId])

  useEffect(() => {
    async function loadCategories() {
      const categories = await fetchAiContentCategories(campaign)
      setCategories(categories)
      setIsLoading(false)
    }
    loadCategories()
  }, [])

  useEffect(() => {
    if (defaultTemplate?.key && !selectedTemplateKey) {
      setSelectedTemplateKey(defaultTemplate.key)
    }
  }, [defaultTemplate, selectedTemplateKey])

  const handleOnNext = () => {
    onNext(selectedTemplateKey)
  }

  return (
    <>
      <header className="text-center">
        <H1>Generate a New Script</H1>
        <Body1 className="mt-4 mb-8">
          Use our AI to generate the script for your text campaign. Select a
          script type below to get started.
        </Body1>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <CircularProgress size={60} />
        </div>
      ) : (
        <>
          {!showManualSelect && defaultTemplate ? (
            <section className="text-center">
              <div className="mb-4">
                <Body1>
                  Recommended script:{' '}
                  <span className="font-bold">{defaultTemplate.name}</span>
                </Body1>
              </div>
              <div className="flex justify-center gap-4">
                <Button
                  color="neutral"
                  onClick={() => setShowManualSelect(true)}
                >
                  Select Different Script
                </Button>
              </div>
            </section>
          ) : (
            <section>
              <AiTemplateSelect
                aiContentCategories={categories}
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
          )}
        </>
      )}

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
