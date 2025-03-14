import SurveyCard from './SurveyCard';

export default function SurveyList(props) {
  return (
    <div className="grid grid-cols-12 gap-4 mt-8">
      {props.surveys?.map((survey) => (
        <div
          className="col-span-12 md:col-span-6 lg:col-span-4"
          key={survey.id}
        >
          <SurveyCard survey={survey} />
        </div>
      ))}
    </div>
  );
}
