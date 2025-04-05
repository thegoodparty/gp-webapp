'use client'
import H2 from '@shared/typography/H2'
import QuestionAnimation from '@shared/animations/QuestionAnimation'
import Body1 from '@shared/typography/Body1'
import CreateQuestion from './CreateQuestion'

export default function NoQuestionsState() {
  return (
    <div className="mt-12 flex flex-col items-center justify-center">
      <H2 className="mt-4">No questions to see here quite yet</H2>
      <Body1 className="mt-2">
        Fun Fact: Door knocking scripts have found that the average person
        believes that they are smarter than the average person!
      </Body1>
      <div className="w-96 relative">
        <QuestionAnimation loop />
      </div>
      <CreateQuestion />
    </div>
  )
}
