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
*/

import H3 from '@shared/typography/H3';
import Body2 from '@shared/typography/Body2';
import Button from '@shared/buttons/Button';
import Link from 'next/link';
import { FcSurvey } from 'react-icons/fc';
import Paper from '@shared/utils/Paper';
import SurveyChips from './SurveyChips';

export default function SurveyCard(props) {
  const { survey } = props;
  const { status, name, description, id } = survey || {};
  return (
    <Link
      href={`/dashboard/door-knocking/surveys/${id}`}
      className="no-underline"
    >
      <Paper className="hover:shadow-lg transition-all duration-300">
        <FcSurvey size={40} className="block my-4" />
        <H3>{name}</H3>
        <Body2>{description}</Body2>
        <SurveyChips survey={survey} />
      </Paper>
    </Link>
  );
}
