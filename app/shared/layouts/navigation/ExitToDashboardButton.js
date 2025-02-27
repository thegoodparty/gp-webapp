'use client';
import { usePathname } from 'next/navigation';
import Button from '@shared/buttons/Button';
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper';

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
        onClick={() => trackEvent(EVENTS.ProUpgrade.ClickExit, { pathname })}
      >
        Exit
      </Button>
    )
  );
};
