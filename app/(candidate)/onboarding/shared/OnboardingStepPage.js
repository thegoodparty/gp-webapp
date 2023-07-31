'use client';
import OnboardingPage from 'app/(candidate)/onboarding/shared/OnboardingPage';
import IssuesPage from '../[slug]/details/[step]/components/IssuesPage';
import PlanPreviewPage from '../[slug]/details/[step]/components/PlanPreviewPage';
import PledgePage from '../[slug]/details/[step]/components/pledgePage';
import RunningAgainstPage from '../[slug]/goals/[step]/components/RunningAgainstPage';
import UserSnapScript from '@shared/scripts/UserSnapScript';

export default function OnboardingStepPage(props) {
  const { pageType } = props;
  if (pageType === 'issuesPage') {
    return (
      <>
        <IssuesPage {...props} />
        <UserSnapScript />
      </>
    );
  }
  if (pageType === 'pledgePage') {
    return (
      <>
        <PledgePage {...props} />
        <UserSnapScript />
      </>
    );
  }
  if (pageType === 'finalDetailsPage') {
    return (
      <>
        <PlanPreviewPage {...props} />
        <UserSnapScript />
      </>
    );
  }
  if (pageType === 'runningAgainst') {
    return (
      <>
        <RunningAgainstPage {...props} />
        <UserSnapScript />
      </>
    );
  }

  return (
    <>
      <OnboardingPage {...props} />
      <UserSnapScript />
    </>
  );
}
