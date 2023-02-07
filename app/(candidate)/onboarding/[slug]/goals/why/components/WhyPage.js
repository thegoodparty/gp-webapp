'use client';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import OnboardingPage from 'app/(candidate)/onboarding/shared/OnboardingPage';

const inputFields = [
  {
    key: 'why100',
    label: '2 minutes / 100 words',
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
];

const generateWhyGoals = async () => {
  const api = gpApi.campaign.onboarding.generateWhyGoals;
  return await gpFetch(api, { adminForce: true });
};

export default function WhyPage(props) {
  return (
    <OnboardingPage
      reGenerateAiCallback={generateWhyGoals}
      inputFields={inputFields}
      nextPath="/goals/what"
      campaignKey="whyGoals"
      header="What is your WHY?"
      subHeader="A good campaign is based on a solid plan with clear objectives. Start building yours by defining your why."
      {...props}
    />
  );
}
