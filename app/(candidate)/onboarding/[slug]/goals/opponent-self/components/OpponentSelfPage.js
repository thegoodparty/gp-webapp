'use client';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import OnboardingPage from 'app/(candidate)/onboarding/shared/OnboardingPage';

const inputFields = [
  {
    key: 'whatRunning',
    label: "What they're running",
    required: true,
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'howDelivered',
    label: "How they've delivered (if incumbent)",
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },

  {
    key: 'whatDelivered',
    label: "What they've delivered (if incumbent)",
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
  {
    key: 'vote',
    label: 'Vote for them',
    type: 'text',
    rows: 6,
    maxLength: 1000,
  },
];

const generateAi = async () => {
  const api = gpApi.campaign.onboarding.generateOpponentSelf;
  return await gpFetch(api, { adminForce: true });
};

export default function OpponentSelfPage(props) {
  return (
    <OnboardingPage
      reGenerateAiCallback={generateAi}
      inputFields={inputFields}
      nextPath="/strategy/who-are-you"
      campaignKey="opponentSelf"
      header="What will your OPPONENT say about THEMSELVES?"
      {...props}
    />
  );
}
