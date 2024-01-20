'use client';
import { useEffect } from 'react';
import OnboardingWrapper from 'app/(candidate)/onboarding-old/shared/OnboardingWrapper';
import { useRouter } from 'next/navigation';
import { updateCampaign } from 'app/(candidate)/onboarding-old/shared/ajaxActions';
import { savingState } from 'app/(candidate)/onboarding-old/shared/OnboardingPage';
// import { launchCampaign } from 'app/candidate/[slug]/components/ReviewBanner';
import RunningAgainstModule from './RunningAgainstModule';

export default function RunningAgainstPage({
  campaign,
  slug,
  header,
  subHeader,
  subSectionKey,
  ...props
}) {
  useEffect(() => {
    savingState.set(() => false);
  }, []);

  const shortVersion = campaign?.details?.filedStatement == 'yes';

  const router = useRouter();

  const handleSave = async (newCampaign) => {
    const updated = campaign;
    if (!updated[subSectionKey]) {
      updated[subSectionKey] = {};
    }

    let newAgainst = [...newCampaign.runningAgainst];
    if (newCampaign.newName && newCampaign.newDesc) {
      newAgainst.push({
        name: newCampaign.newName,
        description: newCampaign.newDesc,
        party: newCampaign.newParty,
      });
    }

    updated[subSectionKey].runningAgainst = newAgainst;
    // updated.campaignPlan = false;
    // updated.campaignPlanStatus = false;

    await updateCampaign(updated);

    if (shortVersion) {
      // launch then redirect to dashboard.
      // await launchCampaign();
      setTimeout(() => {
        window.location.href = '/dashboard/plan';
      }, 200);
    } else {
      savingState.set(() => true);
      setTimeout(() => {
        router.push(`/onboarding/${slug}/campaign-plan`);
      }, 200);
    }
  };

  return (
    <OnboardingWrapper {...props} slug={slug}>
      <div className="max-w-[460px] mx-auto">
        <RunningAgainstModule campaign={campaign} handleSave={handleSave} />
      </div>
    </OnboardingWrapper>
  );
}
