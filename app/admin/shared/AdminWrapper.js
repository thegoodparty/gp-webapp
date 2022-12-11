import MaxWidth from '@shared/layouts/MaxWidth';
import AdminLeftMenu from './AdminLeftMenu';

export default function AdminWrapper({ children, pathname, title }) {
  return (
    <div className="bg-zinc-100 px-4  overflow-x-auto">
      <div
        style={{ minHeight: 'calc(100vh - 80px)' }}
        className="py-14 lg:flex"
      >
        <AdminLeftMenu pathname={pathname} title={title} />
        <div className="flex-1">
          {title && <h1 className="text-2xl mb-8 font-black">{title}</h1>}
          {children}
        </div>
      </div>
    </div>
  );
}
