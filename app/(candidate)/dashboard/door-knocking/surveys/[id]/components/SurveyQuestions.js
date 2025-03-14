import H2 from '@shared/typography/H2';
import SurveyQuestion from './SurveyQuestion';

export default function SurveyQuestions({ questions }) {
  return (
    <div className="mt-12">
      <H2>Questions</H2>
      <div className="grid grid-cols-12 mt-4">
        <div className="bg-gray-200 grid grid-cols-12 col-span-12 py-2 font-semibold rounded-t-md">
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
  );
}
