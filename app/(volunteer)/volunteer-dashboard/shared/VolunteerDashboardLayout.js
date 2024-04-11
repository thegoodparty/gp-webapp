import UserSnapScript from '@shared/scripts/UserSnapScript';
import FullStoryScript from '@shared/scripts/FullStoryScript';
import VolunteerDashboardMenu from './VolunteerDashboardMenu';

export default function VolunteerDashboardLayout({ children, pathname }) {
  return (
    <>
      <UserSnapScript />
      <FullStoryScript />

      <div className="flex min-h-[calc(100vh-56px)] bg-indigo-200">
        <div className="hidden lg:block">
          <VolunteerDashboardMenu pathname={pathname} />
        </div>
        <main className="lg:ml-8 flex-1">{children}</main>
      </div>
    </>
  );
}
