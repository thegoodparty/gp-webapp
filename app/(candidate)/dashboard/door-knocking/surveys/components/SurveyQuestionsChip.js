import Body2 from '@shared/typography/Body2';

import Chip from '@shared/utils/Chip';
import { FaQuestionCircle } from 'react-icons/fa';
export default function SurveyQuestionsChip({ survey, className = '' }) {
  const { questions } = survey || {};
  return (
    <Chip
      className={`mt-4 bg-blue-200 text-blue-800 ${className}`}
      icon={<FaQuestionCircle />}
    >
      <Body2>{questions?.length || 0} Questions</Body2>
    </Chip>
  );
}
