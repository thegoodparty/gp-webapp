import SurveyStatusChip from './SurveyStatusChip';
import SurveySignatureChip from './SurveySignatureChip';
import SurveyQuestionsChip from './SurveyQuestionsChip';

export default function SurveyChips(props) {
  const { survey } = props;
  return (
    <div className="mt-4 flex">
      <SurveyStatusChip survey={survey} />
      <SurveySignatureChip survey={survey} className="ml-4" />
      <SurveyQuestionsChip survey={survey} className="ml-4" />
    </div>
  );
}
