import H6 from '@shared/typography/H6';
import YesNoInput from './YesNoInput';
import FreeTextInput from './FreeTextInput';
import MultiOptionsInput from './MultiOptionsInput';
import PartySelect from './PartySelect';

export default function PersuasionSurvey(props) {
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
      key: 'heardOf',
      title: `Have you ever heard of ${firstName} ${lastName}?`,
      type: 'bool',
    },
    {
      key: 'issuesCareAbout',
      title: `What issues do you care about in the upcoming ${office} election?`,
      type: 'freeText',
    },
    {
      key: 'voteLikelihood',
      title: 'How likely are you to vote for us?',
      type: 'select',
      options: ['Strong yes', 'Likely', 'Undecided', 'Unlikely', 'Strong no'],
    },
    {
      key: 'politicalViews',
      title: 'What are your political views?',
      type: 'partySelect',
    },
    { key: 'canFollow', title: 'Can we follow up with you?', type: 'bool' },
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
            {question.type === 'partySelect' ? (
              <PartySelect
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
