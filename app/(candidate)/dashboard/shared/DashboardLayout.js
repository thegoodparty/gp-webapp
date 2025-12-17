'use client'
import { useEffect } from 'react'
import UserSnapScript from '@shared/scripts/UserSnapScript'
import DashboardMenu from './DashboardMenu'
import AlertSection from '../components/AlertSection'
import { EcanvasserProvider } from '@shared/hooks/EcanvasserProvider'
import { useUser } from '@shared/hooks/useUser'
import { useCampaign } from '@shared/hooks/useCampaign'
import { ProUpgradePrompt } from './ProUpgradePrompt'
import { usePathname, useRouter } from 'next/navigation'
import { weeksTill } from 'helpers/dateHelper'

export default function DashboardLayout({
  children,
  pathname = '',
  campaign,
  showAlert = true,
  wrapperClassName = '',
  hideMenu = false,
}) {
  const [user] = useUser()
  const [hookCampaign] = useCampaign()
  const router = useRouter()
  const hookPathname = usePathname()
  const currentPath = pathname || hookPathname

  const activeCampaign = campaign || hookCampaign
  const { goals, details } = activeCampaign || {}
  const electionDate = details?.electionDate || goals?.electionDate

  useEffect(() => {
    if (currentPath?.startsWith('/dashboard/election-result')) {
      return
    }

    const weeksResult = weeksTill(electionDate)
    const shouldRedirect =
      !details?.primaryElectionDate &&
      typeof details?.wonGeneral !== 'boolean' &&
      weeksResult &&
      typeof weeksResult === 'object' &&
      weeksResult.weeks < 0

    if (shouldRedirect) {
      router.push('/dashboard/election-result')
    }
  }, [currentPath, details?.primaryElectionDate, details?.wonGeneral, electionDate, router])

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
          <ProUpgradePrompt campaign={campaign} user={user} pathname={currentPath} />
          {children}
        </main>
      </div>
    </EcanvasserProvider>
  )
}
