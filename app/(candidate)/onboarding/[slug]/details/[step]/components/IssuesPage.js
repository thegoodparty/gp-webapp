'use client';
import { useEffect } from 'react';
import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import { useRouter } from 'next/navigation';
import { savingState } from 'app/(candidate)/onboarding/shared/OnboardingPage';
import IssuesSelector from './IssuesSelector';

export default function IssuesPage({
  campaign,
  nextPath,
  slug,
  header,
  subHeader,
  positions,
  subSectionKey,
  ...props
}) {
  useEffect(() => {
    savingState.set(() => false);
  }, []);

  const router = useRouter();

  const onSave = async () => {
    let path = nextPath;

    savingState.set(() => true);

    setTimeout(() => {
      router.push(`onboarding/${slug}${path}`);
    }, 200);
  };

  return (
    <OnboardingWrapper {...props} slug={slug}>
      <IssuesSelector
        campaign={campaign}
        positions={positions}
        subSectionKey={subSectionKey}
        onSaveCallback={onSave}
      />
    </OnboardingWrapper>
  );
}
