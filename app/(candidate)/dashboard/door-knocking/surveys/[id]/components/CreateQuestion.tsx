'use client'

import Button from '@shared/buttons/Button'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { useState, FormEvent } from 'react'
import Modal from '@shared/utils/Modal'
import RenderInputField from '@shared/inputs/RenderInputField'
import H2 from '@shared/typography/H2'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import TextField from '@shared/inputs/TextField'
import H4 from '@shared/typography/H4'
import { useEcanvasserSurvey } from '@shared/hooks/useEcanvasserSurvey'

interface CreateQuestionPayload {
  id: string
  name: string
  answerFormatName: string
  answerFormatId: number
  required: boolean
  answers?: { name: string }[]
}

type FormDataKey = 'question' | 'answerFormat' | 'required'

interface FormData {
  question: string
  answerFormat: string
  required: boolean
}

interface FieldConfig {
  label: string
  key: FormDataKey
  type: string
  required?: boolean
  options?: string[]
}

const createQuestion = async (payload: CreateQuestionPayload): Promise<void> => {
  await clientFetch(
    apiRoutes.ecanvasser.surveys.questions.create,
    payload,
  )
}

export default function CreateQuestion(): React.JSX.Element {
  const [survey, refreshSurvey] = useEcanvasserSurvey()
  const { id } = survey
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<string[]>([])
  const [newOption, setNewOption] = useState('')

  const answerFormatOptions = [
    'Multiple Choice',
    'Yes/No',
    'Text',
    'Strongly Agree - Strongly Disagree',
    'Checklist',
  ]

  const fields: FieldConfig[] = [
    {
      label: 'Question',
      key: 'question',
      type: 'text',
      required: true,
    },
    {
      label: 'Answer Format',
      key: 'answerFormat',
      type: 'select',
      options: answerFormatOptions,
      required: true,
    },
  ]

  const [formData, setFormData] = useState<FormData>({
    question: '',
    answerFormat: '',
    required: false,
  })

  const withOptions =
    formData.answerFormat === 'Multiple Choice' ||
    formData.answerFormat === 'Checklist'

  const handleSubmit = async (): Promise<void> => {
    setIsLoading(true)

    const payload: CreateQuestionPayload = {
      id,
      name: formData.question,
      answerFormatName: formData.answerFormat,
      answerFormatId: answerFormatOptions.indexOf(formData.answerFormat) + 1,
      required: formData.required,
    }
    if (withOptions) {
      payload.answers = options.map((option) => ({ name: option }))
    }
    await createQuestion(payload)

    refreshSurvey()
    setFormData({
      question: '',
      answerFormat: '',
      required: false,
    })
    setOptions([])
    setIsLoading(false)
    setIsOpen(false)
  }

  const handleNewOption = (e: FormEvent): void => {
    e.preventDefault()
    setOptions([...options, newOption])
    setNewOption('')
  }

  const handleDeleteOption = (index: number): void => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const canSubmit =
    !isLoading &&
    formData.question &&
    formData.answerFormat &&
    (withOptions ? options.length > 0 : true)

  return (
    <>
      <Button color="primary" onClick={() => setIsOpen(true)}>
        <div className="flex items-center">
          <FaPlus className="mr-2" />
          <div>Add a Question</div>
        </div>
      </Button>
      <Modal open={isOpen} closeCallback={() => setIsOpen(false)}>
        <div className="w-[80vw] max-w-[640px]">
          <H2 className="mb-6">Create a Question</H2>

          {fields.map((field) => (
            <div key={field.key}>
              <RenderInputField
                field={field}
                value={formData[field.key]}
                onChangeCallback={(key, value) =>
                  setFormData({ ...formData, [key]: value })
                }
              />
            </div>
          ))}
          {withOptions && (
            <div className="my-4 p-4 bg-gray-50 rounded-md">
              <H4 className="mb-2">Add options for {formData.answerFormat}</H4>
              <form onSubmit={handleNewOption} noValidate>
                <div className="flex">
                  <TextField
                    label="Option (hit enter to add)"
                    size="small"
                    fullWidth
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                  />
                  <div className="ml-2 min-w-[112px]">
                    <Button
                      color="secondary"
                      onClick={handleNewOption}
                      className="w-full"
                    >
                      <div>Add Option</div>
                    </Button>
                  </div>
                </div>
              </form>
              <ol className="mt-2 list-decimal list-inside">
                {options.map((option, index) => (
                  <li key={option}>
                    {option}{' '}
                    <FaTrash
                      className="ml-2 inline-block text-red-500 cursor-pointer"
                      onClick={() => handleDeleteOption(index)}
                    />
                  </li>
                ))}
              </ol>
            </div>
          )}
          <RenderInputField
            field={{
              label: 'Make this question required/mandatory',
              key: 'required',
              type: 'checkbox',
            }}
            value={formData.required}
            onChangeCallback={(key, value) =>
              setFormData({ ...formData, [key]: value })
            }
          />
          <div className="flex justify-end mt-6 items-center pt-4 border-t border-gray-200">
            <Button color="neutral" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleSubmit}
              className="ml-4"
              disabled={!canSubmit}
              loading={isLoading}
            >
              Create Question
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
