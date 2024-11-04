'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Button from '@shared/buttons/Button';

export const ExitToDashboardButton = () => {
  const pathname = usePathname();
  const isProSignupPath = pathname?.startsWith('/dashboard/pro-sign-up');
  return (
    isProSignupPath && (
      <Button
        href="/dashboard"
        variant="outlined"
        size="small"
        className="!py-1 !text-sm"
      >
        Exit
      </Button>
    )
  );
};
