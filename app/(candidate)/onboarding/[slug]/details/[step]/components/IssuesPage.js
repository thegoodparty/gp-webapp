'use client';
import { useEffect } from 'react';
import OnboardingWrapper from 'app/(candidate)/onboarding/shared/OnboardingWrapper';
import { useRouter } from 'next/navigation';
import { savingState } from 'app/(candidate)/onboarding/shared/OnboardingPage';
import IssuesSelector from './IssuesSelector';
import EditIssues from 'app/candidate/[slug]/components/issues/EditIssues';
import { mapTopIssues } from 'app/candidate/[slug]/edit/mapTopIssues';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import PrimaryButton from '@shared/buttons/PrimaryButton';

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
  const snackbarState = useHookstate(globalSnackbarState);

  const router = useRouter();

  const onNext = async () => {
    if (canContinue()) {
      let path = nextPath;

      savingState.set(() => true);

      setTimeout(() => {
        router.push(`/onboarding/${slug}${path}`);
      }, 200);
    }
  };

  const candidatePositions = mapTopIssues(campaign.details?.topIssues);

  const saveCallback = async (camp) => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Saving...',
        isError: false,
      };
    });
    await updateCampaign(camp);

    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Saved',
        isError: false,
      };
    });
  };

  const canContinue = () => {
    let total = 0;
    if (campaign.details?.topIssues?.positions) {
      total += campaign.details.topIssues.positions.length;
    }
    if (campaign.customIssues) {
      total += campaign.customIssues.length;
    }
    return total >= 3;
  };

  return (
    <OnboardingWrapper {...props} slug={slug}>
      <EditIssues
        campaign={campaign}
        positions={positions}
        subSectionKey={subSectionKey}
        saveCallback={saveCallback}
        isStaged
        candidatePositions={candidatePositions}
        hideTitle
      />
      <div className="text-center mt-12" onClick={onNext}>
        <PrimaryButton disabled={!canContinue()}>NEXT</PrimaryButton>
      </div>
    </OnboardingWrapper>
  );
}
