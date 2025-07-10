'use client'
import UserSnapScript from '@shared/scripts/UserSnapScript'
import DashboardMenu from './DashboardMenu'
import AlertSection from '../components/AlertSection'
import { EcanvasserProvider } from '@shared/hooks/EcanvasserProvider'
import { useUser } from '@shared/hooks/useUser'
import { ProUpgradePrompt } from './ProUpgradePrompt'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
  pathname = '',
  campaign,
  showAlert = true,
  wrapperClassName = '',
  hideMenu = false,
}) {
  const [user] = useUser()
  const hookPathname = usePathname()

  return (
    <EcanvasserProvider>
      <UserSnapScript />

      <div className="flex min-h-[calc(100vh-56px)] bg-indigo-100 p-2 md:p-4">
        {!hideMenu && (
          <div className="hidden lg:block">
            <DashboardMenu
              pathname={pathname || hookPathname}
              campaign={campaign}
            />
          </div>
        )}
        <main
          className={`${!hideMenu ? 'lg:ml-4' : ''} flex-1 ` + wrapperClassName}
        >
          {campaign && showAlert && <AlertSection campaign={campaign} />}
          <ProUpgradePrompt campaign={campaign} user={user} />
          {children}
        </main>
      </div>
    </EcanvasserProvider>
  )
}
