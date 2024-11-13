'use client';
import UserSnapScript from '@shared/scripts/UserSnapScript';
import DashboardMenu from './DashboardMenu';
import { useUser } from '@shared/hooks/useUser';
import AlertSection from '../components/AlertSection';

export default function DashboardLayout({
  children,
  pathname,
  pathToVictory,
  campaign,
  showAlert = true,
  wrapperClassName = '',
}) {
  const [user] = useUser();

  return (
    <>
      <UserSnapScript />

      <div className="flex min-h-[calc(100vh-56px)] bg-indigo-100 p-2">
        <div className="hidden lg:block">
          <DashboardMenu
            pathname={pathname}
            pathToVictory={pathToVictory}
            user={user}
            campaign={campaign}
          />
        </div>
        <main className={'lg:ml-6 flex-1 ' + wrapperClassName}>
          {campaign && showAlert && <AlertSection campaign={campaign} />}
          {children}
        </main>
      </div>
    </>
  );
}
