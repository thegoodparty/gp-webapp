'use client';
import OnboardingPage from 'app/(candidate)/onboarding/shared/OnboardingPage';
import IssuesPage from '../[slug]/details/[step]/components/IssuesPage';
import PlanPreviewPage from '../[slug]/details/[step]/components/PlanPreviewPage';
import PledgePage from '../[slug]/details/[step]/components/pledgePage';
import RunningAgainstPage from '../[slug]/goals/[step]/components/RunningAgainstPage';

export default function OnboardingStepPage(props) {
  const { pageType } = props;
  if (pageType === 'issuesPage') {
    return <IssuesPage {...props} />;
  }
  if (pageType === 'pledgePage') {
    return <PledgePage {...props} />;
  }
  if (pageType === 'finalDetailsPage') {
    return <PlanPreviewPage {...props} />;
  }
  if (pageType === 'runningAgainst') {
    return <RunningAgainstPage {...props} />;
  }

  return <OnboardingPage {...props} />;
}
