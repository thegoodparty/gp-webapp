'use client'
import UserSnapScript from '@shared/scripts/UserSnapScript'
import DashboardMenu from './DashboardMenu'
import AlertSection from '../components/AlertSection'
import ProUpgradeModal from './ProUpgradeModal'
import { EcanvasserProvider } from '@shared/hooks/EcanvasserProvider'
import { useUser } from '@shared/hooks/useUser'

export default function DashboardLayout({
  children,
  pathname,
  campaign,
  showAlert = true,
  wrapperClassName = '',
}) {
  const [user] = useUser()

  return (
    <EcanvasserProvider>
      <UserSnapScript />

      <div className="flex min-h-[calc(100vh-56px)] bg-indigo-100 p-2 md:p-4">
        <div className="hidden lg:block">
          <DashboardMenu pathname={pathname} campaign={campaign} />
        </div>
        <main className={'lg:ml-4 flex-1 ' + wrapperClassName}>
          {campaign && showAlert && <AlertSection campaign={campaign} />}
          <ProUpgradeModal campaign={campaign} user={user} />
          {children}
        </main>
      </div>
    </EcanvasserProvider>
  )
}
