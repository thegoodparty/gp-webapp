'use client';
import OnboardingPage from 'app/(candidate)/onboarding/shared/OnboardingPage';
import IssuesPage from '../[slug]/details/[step]/components/IssuesPage';
import PlanPreviewPage from '../[slug]/details/[step]/components/PlanPreviewPage';
import PledgePage from '../[slug]/details/[step]/components/pledgePage';
import RunningAgainstPage from '../[slug]/goals/[step]/components/RunningAgainstPage';
import UserSnapScript from '@shared/scripts/UserSnapScript';
import FullStoryScript from '@shared/scripts/FullStoryScript';
import BallotRaces from '../[slug]/details/[step]/components/BallotRaces';

export default function OnboardingStepPage(props) {
  const { pageType, races } = props;
  if (pageType === 'issuesPage') {
    return (
      <>
        <IssuesPage {...props} />
        <UserSnapScript />
        <FullStoryScript />
      </>
    );
  }
  if (pageType === 'pledgePage') {
    return (
      <>
        <PledgePage {...props} />
        <UserSnapScript />
        <FullStoryScript />
      </>
    );
  }
  if (pageType === 'finalDetailsPage') {
    return (
      <>
        <PlanPreviewPage {...props} />
        <UserSnapScript />
        <FullStoryScript />
      </>
    );
  }
  if (pageType === 'runningAgainst') {
    return (
      <>
        <RunningAgainstPage {...props} />
        <UserSnapScript />
        <FullStoryScript />
      </>
    );
  }

  return (
    <>
      <OnboardingPage {...props} />
      {races ? <BallotRaces races={races} /> : null}
      <UserSnapScript />
    </>
  );
}
