'use client';
import OnboardingPage from 'app/(candidate)/onboarding/shared/OnboardingPage';
import CrunchingPage from '../[slug]/details/[step]/components/CrunchingPage';
import IssuesPage from '../[slug]/details/[step]/components/IssuesPage';
import PledgePage from '../[slug]/details/[step]/components/pledgePage';
import Checklist from '../[slug]/social/[step]/components/Checklist';
import ProfileBannerPage from '../[slug]/strategy/[step]/components/ProfileBannerPage';
import AIFlow from './AIFiow';

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

  if (pageType === 'profileBanner') {
    return <ProfileBannerPage {...props} />;
  }
  if (pageType === 'AIFlow') {
    return <AIFlow {...props} />;
  }

  if (pageType === 'checklist') {
    return <Checklist {...props} />;
  }
  return <OnboardingPage {...props} />;
}
