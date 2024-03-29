import PrimaryButton from '@shared/buttons/PrimaryButton';
import WarningButton from '@shared/buttons/WarningButton';
import Link from 'next/link';

export default function DashboardOrContinue({
  campaignStatus,
  isDashboardPath,
  closeAll,
}) {
  const { status, slug, step } = campaignStatus || {};
  if (!status) {
    return null;
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
