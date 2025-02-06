'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import WarningButton from '@shared/buttons/WarningButton';
import Link from 'next/link';
import { useCampaignStatus } from '@shared/hooks/useCampaignStatus';
import Button from '@shared/buttons/Button';

export default function DashboardOrContinue({ closeAll, campaignStatus }) {
  const [campaignStatusClient] = useCampaignStatus();
  let resolvedStatus = campaignStatusClient || campaignStatus;
  const { status, slug, step } = resolvedStatus || {};

  if (!status) {
    return (
      <Button
        href={`/onboarding/${step || 'account-type'}`}
        onClick={closeAll}
        id="nav-continue-setup"
        color="secondary"
        className="!py-2 !text-base font-medium border-none ml-2"
      >
        Continue Setup
      </Button>
    );
  }

  const isVolunteer = status === 'volunteer';

  return (
    <div className="ml-4">
      {['candidate', 'volunteer', 'manager'].includes(status) ? (
        <Button
          href={isVolunteer ? '/volunteer-dashboard' : '/dashboard'}
          onClick={closeAll}
          id={isVolunteer ? 'nav-volunteer-dashboard' : 'nav-dashboard'}
          className="font-medium !text-base !py-2 border-none"
        >
          Dashboard
        </Button>
      ) : (
        <Button
          href={`/onboarding/${slug}/${step || 1}`}
          onClick={closeAll}
          id="nav-continue-onboarding"
          color="secondary"
          className="!py-2 !text-base font-medium border-none"
        >
          Continue<span className="hidden lg:inline"> Onboarding</span>
        </Button>
      )}
    </div>
  );
}
