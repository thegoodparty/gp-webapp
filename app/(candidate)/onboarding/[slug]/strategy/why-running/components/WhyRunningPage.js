'use client';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import OnboardingPage from 'app/(candidate)/onboarding/shared/OnboardingPage';

const inputFields = [
  {
    key: 'motivation',
    label: 'Motivation',
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'community',
    label: 'Connection to the community',
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'problems',
    label: 'Problems',
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
];

// const generateAboutOpponentGoals = async () => {
//   const api = gpApi.campaign.onboarding.generateAboutOpponentGoals;
//   return await gpFetch(api, { adminForce: true });
// };

export default function WhyRunningPage(props) {
  return (
    <OnboardingPage
      // reGenerateAiCallback={generateAboutOpponentGoals}
      inputFields={inputFields}
      nextPath="/strategy/why-best-choice"
      campaignKey="whyRunning"
      header="Why are you running?"
      {...props}
    />
  );
}
