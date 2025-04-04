'use client'
import SurveyQuestion from './SurveyQuestion'
import CreateQuestion from './CreateQuestion'
import NoQuestionsState from './NoQuestionsState'
import { useEcanvasserSurvey } from '@shared/hooks/useEcanvasserSurvey'

export default function SurveyQuestions() {
  const [survey] = useEcanvasserSurvey()
  const { questions } = survey || {}

  return !Array.isArray(questions) || questions?.length === 0 ? (
    <NoQuestionsState />
  ) : (
    <div className="mt-6 pt-6 border-t border-black/[0.12]">
      <div className="flex justify-end">
        <CreateQuestion />
      </div>
      <div className="grid grid-cols-12 mt-4">
        <div className="bg-gray-200 grid grid-cols-12 col-span-12 py-4 font-semibold rounded-t-md">
          <div className="col-span-6 px-4">Question</div>
          <div className="col-span-4 lg:col-span-3">Answer format</div>
          <div className="hidden lg:block lg:col-span-2">Required</div>
          <div className="col-span-2 lg:col-span-1">Edit</div>
        </div>
        <div className="col-span-12">
          {questions.map((question, index) => (
            <SurveyQuestion
              key={question.id}
              question={question}
              isEven={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
