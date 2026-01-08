'use client'

import Button from '@shared/buttons/Button'
import { FaTrash } from 'react-icons/fa'
import { useEffect, useState, FormEvent } from 'react'
import Modal from '@shared/utils/Modal'
import RenderInputField from '@shared/inputs/RenderInputField'
import H2 from '@shared/typography/H2'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import TextField from '@shared/inputs/TextField'
import H4 from '@shared/typography/H4'
import { FaPencil } from 'react-icons/fa6'
import { useEcanvasserSurvey } from '@shared/hooks/useEcanvasserSurvey'

interface Answer {
  id: string | number
  name: string
}

interface AnswerType {
  name: string
}

interface Question {
  id: string | number
  name: string
  answer_type: AnswerType
  answers?: Answer[]
}

interface EditQuestionPayload {
  questionId: string | number
  surveyId: string
  name: string
  answers?: { name: string }[]
}

interface EditQuestionProps {
  question: Question
}

type FormDataKey = 'question'

interface FormData {
  question: string
}

interface FieldConfig {
  label: string
  key: FormDataKey
  type: string
  required?: boolean
}

const fields: FieldConfig[] = [
  {
    label: 'Question',
    key: 'question',
    type: 'text',
    required: true,
  },
]

const getQuestion = async (questionId: string | number): Promise<Question> => {
  const resp = await clientFetch<Question>(apiRoutes.ecanvasser.surveys.questions.find, {
    questionId,
  })
  return resp.data
}

const editQuestion = async (payload: EditQuestionPayload): Promise<void> => {
  await clientFetch(
    apiRoutes.ecanvasser.surveys.questions.update,
    payload,
  )
}

export default function EditQuestion(props: EditQuestionProps): React.JSX.Element {
  const [survey, refreshSurvey] = useEcanvasserSurvey()
  const [question, setQuestion] = useState<Question>(props.question)
  const [isOpen, setIsOpen] = useState(false)

  const { id: surveyId } = survey
  const { id: questionId } = question
  const [isLoading, setIsLoading] = useState(false)
  const [answers, setAnswers] = useState<Answer[]>(question.answers || [])
  const [newAnswer, setNewAnswer] = useState('')

  const answerFormat = question.answer_type.name
  const withOptions =
    answerFormat === 'Multiple choice' || answerFormat === 'Checklist'

  useEffect(() => {
    if (question.id && withOptions && !question.answers) {
      const fetchQuestion = async (): Promise<void> => {
        const resp = await getQuestion(question.id)
        setQuestion(resp)
        setAnswers(resp.answers || [])
      }
      fetchQuestion()
    }
  }, [question, withOptions])

  const [formData, setFormData] = useState<FormData>({
    question: question.name,
  })

  const handleSubmit = async (): Promise<void> => {
    setIsLoading(true)

    const payload: EditQuestionPayload = {
      questionId,
      surveyId,
      name: formData.question,
    }
    if (withOptions) {
      payload.answers = answers.map((option) => ({ name: option.name }))
    }
    await editQuestion(payload)

    refreshSurvey()
    setFormData({
      question: '',
    })
    setAnswers([])
    setIsLoading(false)
    setIsOpen(false)
  }

  const handleNewAnswer = (e: FormEvent): void => {
    e.preventDefault()
    setAnswers([...answers, { name: newAnswer, id: newAnswer }])
    setNewAnswer('')
  }

  const handleDeleteAnswer = (index: number): void => {
    setAnswers(answers.filter((_, i) => i !== index))
  }

  const canSubmit =
    !isLoading &&
    formData.question &&
    (withOptions ? answers.length > 0 : true)

  return (
    <>
      <FaPencil className="cursor-pointer" onClick={() => setIsOpen(true)} />
      <Modal open={isOpen} closeCallback={() => setIsOpen(false)}>
        <div className="w-[80vw] max-w-[640px]">
          <H2 className="mb-6">Edit Question ({answerFormat})</H2>

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
              <H4 className="mb-2">Add answers</H4>
              <form onSubmit={handleNewAnswer} noValidate>
                <div className="flex">
                  <TextField
                    label="Answer (hit enter to add)"
                    size="small"
                    fullWidth
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                  />
                  <div className="ml-2 min-w-[112px]">
                    <Button
                      color="secondary"
                      onClick={handleNewAnswer}
                      className="w-full"
                    >
                      <div>Add Answer</div>
                    </Button>
                  </div>
                </div>
              </form>
              <ol className="mt-2 list-decimal list-inside">
                {answers.map((option, index) => (
                  <li key={option.id}>
                    {option.name}{' '}
                    <FaTrash
                      className="ml-2 inline-block text-red-500 cursor-pointer"
                      onClick={() => handleDeleteAnswer(index)}
                    />
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div
            className={`flex justify-end mt-6 items-center pt-4   ${
              withOptions ? 'border-t border-gray-200' : ''
            }`}
          >
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
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
