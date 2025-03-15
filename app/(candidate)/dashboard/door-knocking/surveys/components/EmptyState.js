import SurveyAnimation from '@shared/animations/SurveyAnimation';
import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';
import CreateSurvey from './CreateSurvey';

export default function EmptyState({ teams = [], createCallback }) {
  return (
    <div className=" flex flex-col items-center justify-center my-12">
      <div className="w-96 relative">
        <SurveyAnimation loop />
      </div>
      <H2 className="text-center">No Surveys to see here quite yet!</H2>
      <Body2 className="text-center mt-2 mb-8">
        Surveys can be the easiest way to gauge insights &amp; analyze overall
        trends; find out what your stakeholders really think.
      </Body2>
      <CreateSurvey teams={teams} createCallback={createCallback} />
    </div>
  );
}
