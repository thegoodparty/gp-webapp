'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export const ExitToDashboardButton = () => {
  const pathname = usePathname();
  const isProSignupPath = pathname?.startsWith('/dashboard/pro-sign-up');
  return (
    isProSignupPath && (
      <Link href="/dashboard">
        <PrimaryButton variant="outlined" size="small">
          Exit
        </PrimaryButton>
      </Link>
    )
  );
};
