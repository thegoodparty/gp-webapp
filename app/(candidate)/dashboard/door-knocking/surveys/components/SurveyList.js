'use client';
import { useState } from 'react';
import SurveyCard from './SurveyCard';
import EmptyState from './EmptyState';
import CreateSurvey from './CreateSurvey';
import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';

const fetchSurveys = async () => {
  const resp = await clientFetch(apiRoutes.ecanvasser.surveys.list);
  return resp.data;
};

export default function SurveyList(props) {
  const [surveys, setSurveys] = useState(props.surveys);

  const reFetchSurveys = async () => {
    const resp = await fetchSurveys();
    setSurveys(resp);
  };
  if (surveys?.length === 0) {
    return <EmptyState teams={props.teams} createCallback={reFetchSurveys} />;
  }
  return (
    <>
      <div className="flex justify-end">
        <CreateSurvey teams={props.teams} createCallback={reFetchSurveys} />
      </div>
      <div className="grid grid-cols-12 gap-4 mt-8">
        {surveys?.map((survey) => (
          <div
            className="col-span-12 md:col-span-6 lg:col-span-4"
            key={survey.id}
          >
            <SurveyCard survey={survey} />
          </div>
        ))}
      </div>
    </>
  );
}
