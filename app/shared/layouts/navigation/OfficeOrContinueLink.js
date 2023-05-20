import PrimaryButton from '@shared/buttons/PrimaryButton';
import WarningButton from '@shared/buttons/WarningButton';
import Link from 'next/link';

export default function OfficeOrContinueLink({ campaignStatus }) {
  const { status, slug } = campaignStatus || {};
  return (
    <>
      {!status ? (
        <Link
          href="run-for-office"
          className="hidden lg:block font-medium mr-4"
          id="header-run-for-office"
        >
          <PrimaryButton variant="text" size="medium">
            Run for Office
          </PrimaryButton>
        </Link>
      ) : (
        <div className="mr-4">
          {status === 'candidate' ? (
            <Link href={`/campaign/${slug}/dashboard`}>
              <WarningButton size="medium">Dashboard</WarningButton>
            </Link>
          ) : (
            <Link href={`/onboarding/${slug}/dashboard`}>
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
