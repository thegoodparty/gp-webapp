import MaxWidth from '@shared/layouts/MaxWidth';
import PortalLeftMenu from './ProtalLeftMenu';

export default function PortalWrapper({ children, id, pathname, title }) {
  return (
    <div className="bg-zinc-100">
      <MaxWidth>
        <div
          style={{ minHeight: 'calc(100vh - 80px)' }}
          className="py-14 lg:flex"
        >
          <PortalLeftMenu id={id} pathname={pathname} />
          <div className="flex-1">
            {title && <h1 className="text-2xl mb-8 font-black">{title}</h1>}
            <div>{children}</div>
          </div>
        </div>
      </MaxWidth>
    </div>
  );
}
