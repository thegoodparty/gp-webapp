'use client';
import OnboardingPage from 'app/(candidate)/onboarding/shared/OnboardingPage';
import CrunchingPage from '../[slug]/details/[step]/components/CrunchingPage';
import IssuesPage from '../[slug]/details/[step]/components/IssuesPage';
import PledgePage from '../[slug]/details/[step]/components/pledgePage';
// import AIFlow from './AIFiow';

export default function OnboardingStepPage(props) {
  const { pageType } = props;
  console.log('pageTY', pageType);
  if (pageType === 'issuesPage') {
    return <IssuesPage {...props} />;
  }
  if (pageType === 'pledgePage') {
    return <PledgePage {...props} />;
  }
  if (pageType === 'finalDetailsPage') {
    return <CrunchingPage {...props} />;
  }

  // if (pageType === 'AIFlow') {
  //   return <AIFlow {...props} />;
  // }

  return <OnboardingPage {...props} />;
}
