import PrimaryButton from '@shared/buttons/PrimaryButton';
import WarningButton from '@shared/buttons/WarningButton';
import Link from 'next/link';
import { useCampaignStatus } from '@shared/hooks/useCampaignStatus';

export default function DashboardOrContinue({ isDashboardPath, closeAll }) {
  const [campaignStatus] = useCampaignStatus();
  const { status, slug, step } = campaignStatus || {};
  if (!status) {
    return (
      <Link
        href={`/${step || 'account-type'}`}
        onClick={closeAll}
        id="nav-continue-setup"
      >
        <WarningButton size="medium">
          Continue<span className="hidden lg:inline"> Setup</span>
        </WarningButton>
      </Link>
    );
  }

  let dashboardLink = '/dashboard';

  return (
    <div className="ml-4">
      {status === 'candidate' ? (
        <>
          {!isDashboardPath && (
            <Link
              href={`${dashboardLink}`}
              onClick={closeAll}
              id="nav-dashboard"
            >
              <PrimaryButton size="medium">Dashboard</PrimaryButton>
            </Link>
          )}
        </>
      ) : (
        <>
          {status === 'volunteer' ? (
            <Link
              href="/volunteer-dashboard"
              onClick={closeAll}
              id="nav-volunteer-dashboard"
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
        </>
      )}
    </div>
  );
}
