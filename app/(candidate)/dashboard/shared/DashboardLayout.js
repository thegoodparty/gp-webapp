import DashboardMenu from './DashboardMenu';

export default function DashboardLayout({ children, pathname }) {
  return (
    <div className="flex min-h-[calc(100vh-56px)] bg-slate-50 p-2">
      <div className="hidden lg:block">
        <DashboardMenu pathname={pathname} />
      </div>
      <div className="lg:ml-8 flex-1">{children}</div>
    </div>
  );
}
