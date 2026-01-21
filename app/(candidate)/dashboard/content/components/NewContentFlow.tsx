'use client'

import PrimaryButton from '@shared/buttons/PrimaryButton'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import H2 from '@shared/typography/H2'
import Modal from '@shared/utils/Modal'
import { type ComponentProps, useEffect, useState } from 'react'
import InputFieldsModal from './InputFieldsModal'
import TemplateList from './TemplatesList'
import QuestionProgress, { calcAnswers } from '../../shared/QuestionProgress'
import { fetchPromptInputFields } from 'helpers/fetchPromptInputFields'
import {
  AI_CONTENT_SUB_SECTION_KEY,
  buildAiContentSections,
} from 'helpers/buildAiContentSections'
import { getNewAiContentSectionKey } from 'helpers/getNewAiContentSectionKey'
import { MdAutoAwesome } from 'react-icons/md'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { Campaign, CandidatePosition } from 'helpers/types'
import type { PromptInputField } from 'helpers/fetchPromptInputFields'

interface ChatMessage {
  role: string
  content: string
}

type TemplateListProps = ComponentProps<typeof TemplateList>
type InputFieldsModalProps = ComponentProps<typeof InputFieldsModal>
type InputValues = NonNullable<InputFieldsModalProps['inputValues']>

interface NewContentFlowProps {
  onSelectCallback: (
    key: string,
    additionalPrompts?: ChatMessage[],
    inputValues?: InputValues,
  ) => void
  isProcessing: boolean
  campaign: Campaign | null
  requiresQuestions: TemplateListProps['requiresQuestions']
  candidatePositions: CandidatePosition[] | false | null
  forceOpenModal?: boolean
  categories: TemplateListProps['categories']
}

const NewContentFlow = (props: NewContentFlowProps): React.JSX.Element => {
  const {
    onSelectCallback,
    isProcessing,
    campaign,
    requiresQuestions,
    candidatePositions,
    forceOpenModal,
    categories,
  } = props
  const [sections] = buildAiContentSections(
    campaign,
    AI_CONTENT_SUB_SECTION_KEY,
  )
  const [showModal, setShowModal] = useState(false)
  const [showModal2, setShowModal2] = useState(false)
  const [selected, setSelected] = useState<string | false>('')
  const [inputFields, setInputFields] = useState<PromptInputField[]>([])

  useEffect(() => {
    if (selected !== '') {
      onSelectPrompt()
    }
  }, [selected])

  // used from tutorial
  useEffect(() => {
    if (forceOpenModal) {
      setShowModal(true)
    }
  }, [forceOpenModal])

  const onSelectPrompt = async () => {
    if (selected !== '') {
      const selectedValue = String(selected)
      const content = await fetchPromptInputFields(selectedValue)
      if (!content) {
        const key = getNewAiContentSectionKey(sections, selectedValue)
        onSelectCallback(key)
      } else {
        setInputFields(content)
        setShowModal2(true)
      }
      setShowModal(false)
    }
  }

  const handleAdditionalInput = (
    additionalPrompt: string,
    inputValues: InputValues,
  ) => {
    trackEvent(EVENTS.ContentBuilder.SubmitAdditionalInputs, {
      fields: inputFields,
      values: inputValues,
    })
    const chat: ChatMessage[] = [{ role: 'user', content: additionalPrompt }]
    const key = getNewAiContentSectionKey(sections, String(selected))
    onSelectCallback(key, chat, inputValues)
    setShowModal2(false)
    setInputFields([])
  }

  const handelSelect = (key: string) => {
    setSelected(key)
  }

  const closeModal = () => {
    trackEvent(EVENTS.ContentBuilder.CloseAdditionalInputs, {
      fields: inputFields,
    })
    setSelected(false)
    setShowModal(false)
    setShowModal2(false)
  }

  const resolvedCandidatePositions =
    candidatePositions === false ? null : candidatePositions
  const { answeredQuestions, totalQuestions } = calcAnswers(
    campaign,
    resolvedCandidatePositions,
  )

  return (
    <div>
      <div
        className="mb-7 inline-block new-content-btn"
        onClick={() => {
          trackEvent(EVENTS.ContentBuilder.ClickGenerate)
          setShowModal(true)
        }}
        id="new-content-btn"
      >
        <PrimaryButton>
          <div className="flex items-center">
            <MdAutoAwesome className="mr-2" /> Generate
          </div>
        </PrimaryButton>
      </div>

      <Modal closeCallback={closeModal} open={showModal}>
        <div className="w-[calc(90vw-64px)]">
          <H2
            className="
              pb-5
              mb-5
              border-b
              border-slate-500
              text-center
            "
          >
            Select a Template
          </H2>
          <QuestionProgress
            campaign={campaign}
            candidatePositions={resolvedCandidatePositions}
          />
          <TemplateList
            categories={categories}
            campaign={campaign}
            candidatePositions={resolvedCandidatePositions}
            requiresQuestions={
              answeredQuestions < totalQuestions ? requiresQuestions : {}
            }
            onSelectCallback={handelSelect}
            selectedKey={selected === false ? '' : selected}
          />
          <div
            className="
              mt-16
              flex
              w-full
              justify-end
            "
          >
            <div onClick={closeModal}>
              <SecondaryButton disabled={isProcessing} size="medium">
                Cancel
              </SecondaryButton>
            </div>
          </div>
        </div>
      </Modal>

      <InputFieldsModal
        onSelectCallback={handleAdditionalInput}
        closeModalCallback={closeModal}
        showModal={Boolean(showModal2 && selected)}
        inputFields={inputFields}
      />
    </div>
  )
}

export default NewContentFlow
