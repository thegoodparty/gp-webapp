'use client';
import OnboardingPage from 'app/(candidate)/onboarding-old/shared/OnboardingPage';
import IssuesPage from '../[slug]/details/[step]/components/IssuesPage';
import PlanPreviewPage from '../[slug]/details/[step]/components/PlanPreviewPage';
import PledgePage from '../[slug]/details/[step]/components/pledgePage';
import RunningAgainstPage from '../[slug]/goals/[step]/components/RunningAgainstPage';
import FullStoryScript from '@shared/scripts/FullStoryScript';
import OfficePage from '../[slug]/details/[step]/components/OfficePage';
// import BallotRaces from '../[slug]/details/[step]/components/BallotRaces';

export default function OnboardingStepPage(props) {
  const { pageType, races } = props;
  if (pageType === 'issuesPage') {
    return (
      <>
        <IssuesPage {...props} />
        <FullStoryScript />
      </>
    );
  }
  if (pageType === 'pledgePage') {
    return (
      <>
        <PledgePage {...props} />
        <FullStoryScript />
      </>
    );
  }
  if (pageType === 'officePage') {
    return (
      <>
        <OfficePage {...props} />
        <FullStoryScript />
      </>
    );
  }
  if (pageType === 'finalDetailsPage') {
    return (
      <>
        <PlanPreviewPage {...props} />
        <FullStoryScript />
      </>
    );
  }
  if (pageType === 'runningAgainst') {
    return (
      <>
        <RunningAgainstPage {...props} />
        <FullStoryScript />
      </>
    );
  }

  return (
    <>
      <OnboardingPage {...props} />
    </>
  );
}
