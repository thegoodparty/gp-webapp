'use client';
import OnboardingPage from 'app/(candidate)/onboarding/shared/OnboardingPage';
import CrunchingPage from '../[slug]/details/[step]/components/CrunchingPage';
import IssuesPage from '../[slug]/details/[step]/components/IssuesPage';
import PledgePage from '../[slug]/details/[step]/components/pledgePage';

export default function OnboardingStepPage(props) {
  const { pageType } = props;
  if (pageType === 'issuesPage') {
    return <IssuesPage {...props} />;
  }
  if (pageType === 'pledgePage') {
    return <PledgePage {...props} />;
  }
  if (pageType === 'finalDetailsPage') {
    return <CrunchingPage {...props} />;
  }

  return <OnboardingPage {...props} />;
}
