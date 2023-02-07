'use client';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import OnboardingPage from 'app/(candidate)/onboarding/shared/OnboardingPage';

const inputFields = [
  {
    key: 'notBestChoice',
    label: "Why we aren't the best choice",
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'notDeliver',
    label: "Why we won't deliver results",
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'distinctions',
    label: 'Key distinctions',
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
];

const generateOpponentGoals = async () => {
  const api = gpApi.campaign.onboarding.generateOpponentGoals;
  return await gpFetch(api, { adminForce: true });
};

export default function OpponentPage(props) {
  return (
    <OnboardingPage
      reGenerateAiCallback={generateOpponentGoals}
      inputFields={inputFields}
      nextPath="/goals/about-opponent"
      campaignKey="opponent"
      header="What will your OPPONENT say about YOU? "
      {...props}
    />
  );
}
