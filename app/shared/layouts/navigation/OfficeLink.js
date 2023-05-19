import PrimaryButton from '@shared/buttons/PrimaryButton';
import WarningButton from '@shared/buttons/WarningButton';
import {
  getServerCandidateCookie,
  getServerUser,
} from 'helpers/userServerHelper';
import Link from 'next/link';

export default function OfficeLink() {
  const user = getServerUser();
  const candidate = getServerCandidateCookie();
  return (
    <>
      {!candidate ? (
        <Link
          href="run-for-office"
          className="font-medium mr-4"
          id="desktop-header-run-for-office"
        >
          <PrimaryButton variant="text" size="medium">
            Run for Office
          </PrimaryButton>
        </Link>
      ) : (
        <div className="mr-4">
          {candidate.startsWith('candidate-') ? (
            <Link
              href={`/campaign/${candidate.replace(
                'candidate-',
                '',
              )}/dashboard`}
            >
              <WarningButton size="medium">Dashboard</WarningButton>
            </Link>
          ) : (
            <Link href={`/onboarding/${candidate}/dashboard`}>
              <WarningButton size="medium">Continue Onboarding</WarningButton>
            </Link>
          )}
        </div>
      )}
    </>
  );
}
