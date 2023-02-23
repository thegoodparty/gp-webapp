'use client';
import OnboardingPage from 'app/(candidate)/onboarding/shared/OnboardingPage';
import CrunchingPage from './crunchingPage';
import IssuesPage from './IssuesPage';
import PledgePage from './pledgePage';

export default function DetailsGoalsStepPage(props) {
  const { fields, step, pageType } = props;
  if (pageType === 'issuesPage') {
    return (
      <IssuesPage
        nextPath={`/details/${step + 1}`}
        campaignKey="details"
        {...props}
      />
    );
  }
  if (pageType === 'pledgePage') {
    return (
      <PledgePage
        nextPath={`/details/${step + 1}`}
        campaignKey="details"
        {...props}
      />
    );
  }
  if (pageType === 'finalPage') {
    return <CrunchingPage {...props} />;
  }
  return (
    <OnboardingPage
      inputFields={fields}
      nextPath={`/details/${step + 1}`}
      campaignKey="details"
      {...props}
    />
  );
}
