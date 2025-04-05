import AdminLeftMenu from './AdminLeftMenu'
import UserSnapScript from '@shared/scripts/UserSnapScript'

export default function AdminWrapper({ children, pathname, title }) {
  return (
    <div className="bg-zinc-100 px-4 ">
      <div
        style={{ minHeight: 'calc(100vh - 56px)' }}
        className="py-14 lg:flex"
      >
        <AdminLeftMenu pathname={pathname} title={title} />
        <div className="lg:w-[calc(100vw_-_240px)]">
          {title && <h1 className="text-2xl mb-8 font-black">{title}</h1>}
          {children}
        </div>
      </div>
      <UserSnapScript />
    </div>
  )
}
