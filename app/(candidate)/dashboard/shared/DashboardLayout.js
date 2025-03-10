'use client';
import UserSnapScript from '@shared/scripts/UserSnapScript';
import DashboardMenu from './DashboardMenu';
import AlertSection from '../components/AlertSection';
import { EcanvasserProvider } from '@shared/hooks/EcanvasserProvider';

export default function DashboardLayout({
  children,
  pathname,
  pathToVictory,
  campaign,
  showAlert = true,
  wrapperClassName = '',
}) {
  return (
    <EcanvasserProvider>
      <UserSnapScript />

      <div className="flex min-h-[calc(100vh-56px)] bg-indigo-100 p-2">
        <div className="hidden lg:block">
          <DashboardMenu
            pathname={pathname}
            pathToVictory={pathToVictory}
            campaign={campaign}
          />
        </div>
        <main className={'lg:ml-6 flex-1 ' + wrapperClassName}>
          {campaign && showAlert && <AlertSection campaign={campaign} />}
          {children}
        </main>
      </div>
    </EcanvasserProvider>
  );
}
