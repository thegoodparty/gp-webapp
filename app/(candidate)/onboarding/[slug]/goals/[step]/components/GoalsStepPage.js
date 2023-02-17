'use client';
import OnboardingPage from 'app/(candidate)/onboarding/shared/OnboardingPage';

export default function GoalsStepPage(props) {
  console.log('goals step page');
  return (
    <OnboardingPage
      inputFields={props.fields}
      nextPath={`/goals/${props.step + 1}`}
      campaignKey="goals"
      {...props}
    />
  );
}
