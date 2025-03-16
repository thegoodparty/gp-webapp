'use client';
import { useState } from 'react';
import H2 from '@shared/typography/H2';
import SurveyQuestion from './SurveyQuestion';
import QuestionAnimation from '@shared/animations/QustionAnimation';
import Body1 from '@shared/typography/Body1';
import CreateQuestion from './CreateQuestion';

export default function SurveyQuestions(props) {
  const { survey, reFetchSurvey } = props;
  const { questions } = survey;
  const createCallback = () => {
    reFetchSurvey();
  };
  if (questions.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center">
        <H2 className="mt-4">No questions to see here quite yet</H2>
        <Body1 className="mt-2">
          Fun Fact: Surveys have found that the average person believes that
          they are smarter than the average person!
        </Body1>
        <div className="w-96 relative">
          <QuestionAnimation loop />
        </div>
        <CreateQuestion survey={survey} createCallback={createCallback} />
      </div>
    );
  }
  return (
    <div className="mt-6 pt-6 border-t border-black/[0.12]">
      <div className="flex justify-end">
        <CreateQuestion survey={survey} createCallback={createCallback} />
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
              survey={survey}
              question={question}
              isEven={index % 2 === 0}
              refreshSurvey={reFetchSurvey}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
