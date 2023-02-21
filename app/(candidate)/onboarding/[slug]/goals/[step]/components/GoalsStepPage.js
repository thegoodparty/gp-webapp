'use client';
import OnboardingPage from 'app/(candidate)/onboarding/shared/OnboardingPage';
import IssuesPage from './IssuesPage';

export default function GoalsStepPage(props) {
  const { fields, step, isIssuePage } = props;
  return (
    <>
      {isIssuePage ? (
        <IssuesPage
          inputFields={fields}
          nextPath={`/goals/${step + 1}`}
          campaignKey="goals"
          {...props}
        />
      ) : (
        <OnboardingPage
          inputFields={fields}
          nextPath={`/goals/${step + 1}`}
          campaignKey="goals"
          {...props}
        />
      )}
    </>
  );
}
