'use client';
import OnboardingPage from 'app/(candidate)/onboarding/shared/OnboardingPage';
import IssuesPage from './IssuesPage';
import PledgePage from './pledgePage';

export default function GoalsStepPage(props) {
  const { fields, step, isIssuePage, isPledgePage } = props;
  if (isIssuePage) {
    return (
      <IssuesPage
        nextPath={`/goals/${step + 1}`}
        campaignKey="goals"
        {...props}
      />
    );
  }
  if (isPledgePage) {
    return (
      <PledgePage
        nextPath={`/goals/${step + 1}`}
        campaignKey="goals"
        {...props}
      />
    );
  }
  return (
    <OnboardingPage
      inputFields={fields}
      nextPath={`/goals/${step + 1}`}
      campaignKey="goals"
      {...props}
    />
  );
}
