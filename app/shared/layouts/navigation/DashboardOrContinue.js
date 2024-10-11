'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import WarningButton from '@shared/buttons/WarningButton';
import Link from 'next/link';
import { useCampaignStatus } from '@shared/hooks/useCampaignStatus';

export default function DashboardOrContinue({ closeAll, campaignStatus }) {
  const [campaignStatusClient] = useCampaignStatus();
  let resolvedStatus = campaignStatusClient || campaignStatus;
  const { status, slug, step } = resolvedStatus || {};

  if (!status) {
    return (
      <Link
        href={`/onboarding/${step || 'account-type'}`}
        onClick={closeAll}
        id="nav-continue-setup"
      >
        <WarningButton size="medium">Continue Setup</WarningButton>
      </Link>
    );
  }

  const isVolunteer = status === 'volunteer';

  return (
    <div className="ml-4">
      {['candidate', 'volunteer', 'manager'].includes(status) ? (
        <Link
          href={isVolunteer ? '/volunteer-dashboard' : '/dashboard'}
          onClick={closeAll}
          id={isVolunteer ? 'nav-volunteer-dashboard' : 'nav-dashboard'}
        >
          <PrimaryButton size="medium">Dashboard</PrimaryButton>
        </Link>
      ) : (
        <Link
          href={`/onboarding/${slug}/${step || 1}`}
          onClick={closeAll}
          id="nav-continue-onboarding"
        >
          <WarningButton size="medium">
            Continue<span className="hidden lg:inline"> Onboarding</span>
          </WarningButton>
        </Link>
      )}
    </div>
  );
}
