'use client';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import OnboardingPage from 'app/(candidate)/onboarding/shared/OnboardingPage';

const inputFields = [
  {
    key: 'issuesSolutions',
    label: 'Key issues and solutions',
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'distinction',
    label: 'Distinction to other candidates',
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

export default function WhyBestChoicePage(props) {
  return (
    <OnboardingPage
      // reGenerateAiCallback={generateAboutOpponentGoals}
      inputFields={inputFields}
      nextPath="/team/endorsements"
      campaignKey="whyBestChoice"
      header="Why you are the best choice?"
      {...props}
    />
  );
}
