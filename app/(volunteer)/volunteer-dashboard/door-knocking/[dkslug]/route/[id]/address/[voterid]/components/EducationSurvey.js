import H6 from '@shared/typography/H6';
import YesNoInput from './YesNoInput';
import FreeTextInput from './FreeTextInput';
import MultiOptionsInput from './MultiOptionsInput';

export default function EducationSurvey(props) {
  const { voter, handleSave, survey } = props;
  const { campaign } = voter;
  if (!campaign) return null;
  const questions = [
    {
      key: 'harderForIndependents',
      title:
        'Why do you think it is so much harder for independents to get elected?',
      type: 'freeText',
    },
    {
      key: 'importantIssue',
      title:
        'What is the most important issue to you in the upcoming election?',
      type: 'freeText',
    },
    {
      key: 'helpIndependents',
      title:
        'Would you be interested in helping more independent candidates win?',
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
