import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import SurveyStatusChip from '../../components/SurveyStatusChip';
import SurveySignatureChip from '../../components/SurveySignatureChip';

export default function DoorKnockingSurveyPage(props) {
  const { survey } = props;
  const { name, description } = survey || {};
  return (
    <>
      <H1>{name}</H1>
      <Body2 className="mt-2">{description}</Body2>
      <div className="mt-4 flex">
        <SurveyStatusChip survey={survey} />
        <SurveySignatureChip survey={survey} className="ml-4" />
      </div>
    </>
  );
}
