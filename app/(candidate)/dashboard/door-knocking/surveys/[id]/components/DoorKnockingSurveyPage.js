/*

survey example
{
      questions: [Array],
      id: 1,
      name: 'Canidate for Ward 1',
      description: 'Would you support Hugo as your Ward 1 Alderman?',
      status: 'Live',
      created_by: 544442,
      updated_at: '2025-03-05T19:39:43Z',
      created_at: '2025-03-03T21:09:48Z',
      nationbuilder_id: null,
      team_id: 2,
      requires_signature: false
    }

quertion example

[
  {
    required: false,
    answer_type: { id: 4, name: 'Strongly Agree - Strongly Disagree' },
    id: 1,
    name: 'Would you support Hugo as your Ward 1 Alderman?',
    order: 1,
    survey_id: 1,
    updated_at: '2025-03-03T21:10:34Z',
    nationbuilder_id: null,
    created_at: '2025-03-03T21:10:34Z'
  },
  {
    required: false,
    answer_type: { id: 2, name: 'Yes/No' },
    id: 2,
    name: 'Will you vote on April 1st for Hugo for Alderman?',
    order: 2,
    survey_id: 1,
    updated_at: '2025-03-03T21:11:04Z',
    nationbuilder_id: null,
    created_at: '2025-03-03T21:11:04Z'
  },
  {
    required: false,
    answer_type: { id: 2, name: 'Yes/No' },
    id: 3,
    name: 'Would you like a sign for your yard to help your neighbors make their choice for Alderman?',
    order: 3,
    survey_id: 1,
    updated_at: '2025-03-03T21:11:39Z',
    nationbuilder_id: null,
    created_at: '2025-03-03T21:11:39Z'
  },
  {
    required: false,
    answer_type: { id: 2, name: 'Yes/No' },
    id: 4,
    name: 'Would you like to help out with the campaign?',
    order: 4,
    survey_id: 1,
    updated_at: '2025-03-03T21:12:04Z',
    nationbuilder_id: null,
    created_at: '2025-03-03T21:12:04Z'
  }
]

*/
import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout';
import Paper from '@shared/utils/Paper';
import Link from 'next/link';
import { MdOutlineArrowBack } from 'react-icons/md';
import SurveyHeader from './SurveyHeader';
import SurveyQuestions from './SurveyQuestions';

export default function DoorKnockingSurveyPage(props) {
  const { survey } = props;
  const { name, description, questions } = survey;
  console.log('questions', questions);
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
        <SurveyHeader survey={survey} />
        <SurveyQuestions questions={questions} />
      </Paper>
    </DashboardLayout>
  );
}
