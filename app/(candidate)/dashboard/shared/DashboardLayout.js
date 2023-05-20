import DashboardMenu from './DashboardMenu';

export default function DashboardLayout({ children, path }) {
  return (
    <div className="flex min-h-[calc(100vh-56px)] bg-slate-50 p-2">
      <div>
        <DashboardMenu path={path} />
      </div>
      <div className="ml-8  flex-1">{children}</div>
    </div>
  );
}
