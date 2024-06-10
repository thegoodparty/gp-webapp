import UserSnapScript from '@shared/scripts/UserSnapScript';
import VolunteerDashboardMenu from './VolunteerDashboardMenu';

export default function VolunteerDashboardLayout({ children, pathname }) {
  return (
    <>
      <UserSnapScript />

      <div className="flex min-h-[calc(100vh-84px)] bg-indigo-50 lg:mt-4 lg:px-4">
        <div className="hidden lg:block">
          <VolunteerDashboardMenu pathname={pathname} />
        </div>
        <main className="lg:ml-8 flex-1">{children}</main>
      </div>
    </>
  );
}
