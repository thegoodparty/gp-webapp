import UserSnapScript from '@shared/scripts/UserSnapScript';
import DashboardMenu from './DashboardMenu';
import FullStoryScript from '@shared/scripts/FullStoryScript';

export default function DashboardLayout({
  children,
  pathname,
  candidateSlug,
  pathToVictory,
  user,
  campaign,
}) {
  return (
    <>
      <UserSnapScript />
      <FullStoryScript />

      <div className="flex min-h-[calc(100vh-56px)] bg-slate-50 p-2">
        <div className="hidden lg:block">
          <DashboardMenu
            pathname={pathname}
            candidateSlug={candidateSlug}
            pathToVictory={pathToVictory}
            user={user}
            campaign={campaign}
          />
        </div>
        <main className="lg:ml-8 flex-1">{children}</main>
      </div>
    </>
  );
}
