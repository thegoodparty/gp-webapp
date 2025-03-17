import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import SurveyChips from '../../components/SurveyChips';
import EditSurvey from './EditSurvey';
import { useEcanvasserSurvey } from '@shared/hooks/useEcanvasserSurvey';

export default function SurveyHeader() {
  const [survey] = useEcanvasserSurvey();
  const { name, description } = survey || {};
  return (
    <>
      <div className="md:flex justify-between items-center">
        <H1 className="mb-4">{name}</H1>
        <EditSurvey />
      </div>
      <Body2 className="mt-2">{description}</Body2>
      <SurveyChips survey={survey} />
    </>
  );
}
