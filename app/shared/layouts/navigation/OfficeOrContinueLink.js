import PrimaryButton from '@shared/buttons/PrimaryButton';
import WarningButton from '@shared/buttons/WarningButton';
import Link from 'next/link';

export default function OfficeOrContinueLink({
  campaignStatus,
  isDashboardPath,
  closeAll,
}) {
  const { status, slug, pathToVictory } = campaignStatus || {};

  let dashboardLink = '/dashboard';
  if (!pathToVictory || pathToVictory !== 'Complete') {
    dashboardLink = '/dashboard/plan';
  }

  return (
    <>
      {!status ? (
        <Link
          href="/run-for-office"
          className="hidden lg:block font-medium mr-2"
          id="nav-run-for office"
          onClick={closeAll}
        >
          <PrimaryButton variant="text" size="medium">
            Run for Office
          </PrimaryButton>
        </Link>
      ) : (
        <div className="mr-2">
          {status === 'candidate' ? (
            <>
              {!isDashboardPath && (
                <Link
                  href={`${dashboardLink}`}
                  onClick={closeAll}
                  id="nav-dashboard"
                >
                  <WarningButton size="medium">Dashboard</WarningButton>
                </Link>
              )}
            </>
          ) : (
            <Link
              href={`/onboarding/${slug}/dashboard`}
              onClick={closeAll}
              id="nav-continue-onboarding"
            >
              <WarningButton size="medium">
                Continue<span className="hidden lg:inline"> Onboarding</span>
              </WarningButton>
            </Link>
          )}
        </div>
      )}
    </>
  );
}
