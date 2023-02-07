'use client';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import OnboardingPage from 'app/(candidate)/onboarding/shared/OnboardingPage';

const inputFields = [
  {
    key: 'whyTheyRunning',
    label: "Why they're running",
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'notBetter',
    label: "Why they aren't the better choice",
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'incumbentFailed',
    label: "How they've failed to deliver (if they're an incumbent)",
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'keyDistinctions',
    label: 'Key distinctions',
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
];

const generateAboutOpponentGoals = async () => {
  const api = gpApi.campaign.onboarding.generateAboutOpponentGoals;
  return await gpFetch(api, { adminForce: true });
};

export default function OpponentSelfPage(props) {
  return (
    <OnboardingPage
      reGenerateAiCallback={generateAboutOpponentGoals}
      inputFields={inputFields}
      nextPath="/goals/opponent-self"
      campaignKey="aboutOpponent"
      header="What will YOU say about your OPPONENT? "
      {...props}
    />
  );
}
