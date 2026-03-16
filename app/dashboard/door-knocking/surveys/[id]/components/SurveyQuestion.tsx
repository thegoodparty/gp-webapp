import DeleteQuestion from './DeleteQuestion'
import EditQuestion from './EditQuestion'

interface AnswerType {
  name: string
}

interface Question {
  id: number | string
  name: string
  answer_type: AnswerType
  required: boolean
}

interface SurveyQuestionProps {
  question: Question
  isEven: boolean
}

export default function SurveyQuestion({
  question,
  isEven,
}: SurveyQuestionProps): React.JSX.Element {
  const { name, answer_type, required } = question
  const rowClass = `grid grid-cols-12 col-span-12 py-3 items-center ${
    isEven ? 'bg-white' : 'bg-gray-50'
  }`

  return (
    <>
      <div className={rowClass}>
        <div className="col-span-6 px-4">{name}</div>
        <div className="col-span-4 lg:col-span-3">{answer_type.name}</div>
        <div className="hidden lg:block lg:col-span-2">
          {required ? 'Yes' : 'No'}
        </div>
        <div className="col-span-2 lg:col-span-1">
          <div className="flex items-center  gap-3">
            <EditQuestion question={question} />
            <DeleteQuestion question={question} />
          </div>
        </div>
      </div>
    </>
  )
}
