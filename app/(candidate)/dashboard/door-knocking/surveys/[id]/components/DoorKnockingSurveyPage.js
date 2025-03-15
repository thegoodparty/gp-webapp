'use client';
import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout';
import Paper from '@shared/utils/Paper';
import Link from 'next/link';
import { MdOutlineArrowBack } from 'react-icons/md';
import SurveyHeader from './SurveyHeader';
import SurveyQuestions from './SurveyQuestions';
import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';
import { useState } from 'react';

const fetchSurvey = async (id) => {
  const resp = await clientFetch(apiRoutes.ecanvasser.surveys.find, {
    id,
  });
  return resp.data;
};

export default function DoorKnockingSurveyPage(props) {
  const [survey, setSurvey] = useState(props.survey);
  const { questions } = survey;

  const reFetchSurvey = async () => {
    const resp = await fetchSurvey(props.survey.id);
    setSurvey(resp);
  };
  return (
    <DashboardLayout {...props} showAlert={false}>
      <Link
        href="/dashboard/door-knocking/surveys"
        className="my-2 flex items-center text-gray-500 "
      >
        <MdOutlineArrowBack className="mr-2 " />
        <Body2 className="">Back to all surveys</Body2>
      </Link>
      <Paper className="mt-4">
        <SurveyHeader survey={survey} reFetchSurvey={reFetchSurvey} />
        <SurveyQuestions survey={survey} reFetchSurvey={reFetchSurvey} />
      </Paper>
    </DashboardLayout>
  );
}
