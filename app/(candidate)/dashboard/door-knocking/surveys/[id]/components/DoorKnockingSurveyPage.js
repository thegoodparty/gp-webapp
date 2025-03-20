'use client';
import Body2 from '@shared/typography/Body2';
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout';
import Paper from '@shared/utils/Paper';
import Link from 'next/link';
import { MdOutlineArrowBack } from 'react-icons/md';
import SurveyHeader from './SurveyHeader';
import SurveyQuestions from './SurveyQuestions';
import { EcanvasserSurveyProvider } from '@shared/hooks/EcanvasserSurveyProvider';

export default function DoorKnockingSurveyPage(props) {
  return (
    <EcanvasserSurveyProvider survey={props.survey}>
      <DashboardLayout {...props} showAlert={false}>
        <Link
          href="/dashboard/door-knocking/surveys"
          className="my-2 flex items-center text-gray-500 "
        >
          <MdOutlineArrowBack className="mr-2 " />
          <Body2 className="">Back to all door knocking scripts</Body2>
        </Link>
        <Paper className="mt-4">
          <SurveyHeader />
          <SurveyQuestions />
        </Paper>
      </DashboardLayout>
    </EcanvasserSurveyProvider>
  );
}
