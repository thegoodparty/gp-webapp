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

export default function GoalsStepPage(props) {
  return (
    <OnboardingPage
      inputFields={props.fields}
      nextPath={`/goals/${props.step + 1}`}
      campaignKey="goals"
      {...props}
    />
  );
}
