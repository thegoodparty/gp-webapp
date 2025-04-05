import UserSnapScript from '@shared/scripts/UserSnapScript'
import ServeMenu from './ServeMenu'

export default function ServeLayout({ children, pathname }) {
  return (
    <>
      <UserSnapScript />
      <div className="flex min-h-[calc(100vh-56px)] bg-indigo-100 p-2">
        <div className="hidden lg:block">
          <ServeMenu pathname={pathname} />
        </div>
        <main className="lg:ml-6 flex-1">{children}</main>
      </div>
    </>
  )
}
