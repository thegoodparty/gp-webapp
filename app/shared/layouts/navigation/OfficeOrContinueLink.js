import PrimaryButton from '@shared/buttons/PrimaryButton';
import WarningButton from '@shared/buttons/WarningButton';
import Link from 'next/link';

export default function OfficeOrContinueLink({
  campaignStatus,
  isDashboardPath,
  closeAll,
}) {
  const { status, slug } = campaignStatus || {};
  return (
    <>
      {!status ? (
        <Link
          href="run-for-office"
          className="hidden lg:block font-medium mr-2"
          id="header-run-for-office"
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
                <Link href={`/dashboard`} onClick={closeAll}>
                  <WarningButton size="medium">Dashboard</WarningButton>
                </Link>
              )}
            </>
          ) : (
            <Link href={`/onboarding/${slug}/dashboard`} onClick={closeAll}>
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
