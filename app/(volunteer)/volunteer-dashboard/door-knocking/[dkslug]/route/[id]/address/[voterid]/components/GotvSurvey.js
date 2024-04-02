import H6 from '@shared/typography/H6';
import YesNoInput from './YesNoInput';
import FreeTextInput from './FreeTextInput';
import MultiOptionsInput from './MultiOptionsInput';

export default function GotvSurvey(props) {
  const { voter, handleSave, survey } = props;
  const { campaign } = voter;
  if (!campaign) return null;
  const { firstName, lastName, office } = campaign;
  const questions = [
    {
      key: 'planningToVote',
      title: 'Are you planning to vote in the upcoming election?',
      type: 'bool',
    },
    {
      key: 'alreadyVoted',
      title: 'Has the voter already voted?',
      type: 'bool',
    },
    {
      key: 'needRide',
      title: 'Do you need a ride to the polling station?',
      type: 'bool',
    },
  ];
  return (
    <div>
      {questions.map((question, index) => {
        return (
          <div key={question.key} className="p-4 bg-white rounded-lg mb-4">
            <H6 className="text-center mb-4">{question.title}</H6>
            {question.type === 'bool' ? (
              <YesNoInput
                onChange={handleSave}
                surveyKey={question.key}
                initialValue={survey ? survey[question.key] : false}
              />
            ) : null}
            {question.type === 'freeText' ? (
              <FreeTextInput
                onChange={handleSave}
                surveyKey={question.key}
                initialValue={survey ? survey[question.key] : false}
              />
            ) : null}
            {question.type === 'select' ? (
              <MultiOptionsInput
                options={question.options}
                onChange={handleSave}
                surveyKey={question.key}
                initialValue={survey ? survey[question.key] : false}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
