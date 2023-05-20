import DashboardMenu from 'app/(candidate)/dashboard/shared/DashboardMenu';
import Hamburger from 'hamburger-react';

export default function TopDashboardMenu({ open, toggleCallback, pathname }) {
  return (
    <div className="lg:hidden">
      <Hamburger toggled={open} toggle={toggleCallback} size={20} />
      {open && (
        <div className="fixed top-14 left-0 w-screen h-[calc(100vh-56px)] bg-slate-50 p-2 overflow-x-hidden overflow-y-auto">
          <DashboardMenu pathname={pathname} />
        </div>
      )}
    </div>
  );
}
