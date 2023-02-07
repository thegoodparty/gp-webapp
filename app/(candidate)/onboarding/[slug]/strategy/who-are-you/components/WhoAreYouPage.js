'use client';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import OnboardingPage from 'app/(candidate)/onboarding/shared/OnboardingPage';

const inputFields = [
  {
    key: 'biography',
    label: 'Biography',
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'values',
    label: 'Values',
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'achievements',
    label: 'Achievements',
    required: true,
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
      nextPath="/strategy/why-running"
      campaignKey="whoAreYou"
      header="Who are you?"
      {...props}
    />
  );
}
