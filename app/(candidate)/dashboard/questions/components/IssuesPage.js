'use client';
import { useEffect } from 'react';
import OnboardingWrapper from 'app/(candidate)/onboarding-old/shared/OnboardingWrapper';
import { useRouter } from 'next/navigation';
import { savingState } from 'app/(candidate)/onboarding-old/shared/OnboardingPage';
// import EditIssues from 'app/candidate/[slug]/components/issues/EditIssues';
// import { mapTopIssues } from 'app/candidate/[slug]/edit/mapTopIssues';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import { updateCampaign } from 'app/(candidate)/onboarding-old/shared/ajaxActions';
import PrimaryButton from '@shared/buttons/PrimaryButton';

export default function IssuesPage({
  campaign,
  nextPath,
  slug,
  header,
  subHeader,
  positions,
  subSectionKey,
  candidatePositions,
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

  const saveCallback = async (camp) => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Saving...',
        isError: false,
      };
    });
    const saveResp = await updateCampaign(camp);
    if (!saveResp || typeof saveResp !== 'object') {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message:
            'Error saving issue. Please report an issue on the Feedback sidebar.',
          isError: true,
        };
      });
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Saved',
          isError: false,
        };
      });
    }
  };

  const canContinue = () => {
    let total = 0;
    if (candidatePositions) {
      total += candidatePositions.length;
    }
    if (campaign.customIssues) {
      total += campaign.customIssues.length;
    }
    return total >= 3;
  };

  return (
    <OnboardingWrapper {...props} slug={slug}>
      {/* <EditIssues
        campaign={campaign}
        positions={positions}
        subSectionKey={subSectionKey}
        saveCallback={saveCallback}
        isStaged
        candidatePositions={candidatePositions}
        hideTitle
      /> */}
      <div className="text-center mt-12" onClick={onNext}>
        <PrimaryButton disabled={!canContinue()}>NEXT</PrimaryButton>
      </div>
    </OnboardingWrapper>
  );
}
