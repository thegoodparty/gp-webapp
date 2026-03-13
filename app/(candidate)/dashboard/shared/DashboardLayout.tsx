'use client'
import { ReactNode, useEffect } from 'react'
import DashboardMenu from './DashboardMenu'
import AlertSection from '../components/AlertSection'
import { EcanvasserProvider } from '@shared/hooks/EcanvasserProvider'
import { useUser } from '@shared/hooks/useUser'
import { useCampaign } from '@shared/hooks/useCampaign'
import { ProUpgradePrompt } from './ProUpgradePrompt'
import { usePathname, useRouter } from 'next/navigation'
import { weeksTill } from 'helpers/dateHelper'
import { Campaign } from 'helpers/types'
import { Sidebar, SidebarInset, SidebarProvider, useSidebar } from '@styleguide'
import { MdClose, MdMenu } from 'react-icons/md'
import { useFlagOn } from '@shared/experiments/FeatureFlagsProvider'

interface DashboardLayoutProps {
  children: ReactNode
  pathname?: string
  campaign?: Campaign | null
  showAlert?: boolean
  wrapperClassName?: string
  hideMenu?: boolean
}

const DashboardLayout = ({
  children,
  pathname = '',
  campaign,
  showAlert = true,
  wrapperClassName = '',
  hideMenu = false,
}: DashboardLayoutProps): React.JSX.Element => {
  const [user] = useUser()
  const [hookCampaign] = useCampaign()
  const router = useRouter()
  const hookPathname = usePathname()
  const currentPath = pathname || hookPathname
  const { on: navRefreshEnabled } = useFlagOn('win-serve-split')

  const activeCampaign = campaign || hookCampaign
  const details = activeCampaign?.details
  const goals =
    activeCampaign && 'goals' in activeCampaign
      ? activeCampaign.goals
      : undefined
  const goalsObj = goals && typeof goals === 'object' ? goals : null
  const goalsElectionDate =
    goalsObj &&
    'electionDate' in goalsObj &&
    typeof goalsObj.electionDate === 'string'
      ? goalsObj.electionDate
      : undefined
  const electionDate = details?.electionDate || goalsElectionDate

  useEffect(() => {
    if (currentPath?.startsWith('/dashboard/election-result')) {
      return
    }

    const weeksResult = weeksTill(electionDate)
    const shouldRedirect =
      typeof details?.wonGeneral !== 'boolean' &&
      weeksResult &&
      typeof weeksResult === 'object' &&
      weeksResult.weeks < 0

    if (shouldRedirect) {
      router.push('/dashboard/election-result')
    }
  }, [currentPath, details?.wonGeneral, electionDate, router])

  if (navRefreshEnabled) {
    return (
      <EcanvasserProvider>
        <SidebarProvider>
          {!hideMenu && (
            <Sidebar>
              <DashboardMenu pathname={currentPath} />
            </Sidebar>
          )}
          <SidebarInset className="bg-[#f5f5f5]">
            {!hideMenu && <MobileMenuTrigger />}
            <div className={`flex-1 p-2 md:p-4 ${wrapperClassName}`}>
              {campaign && showAlert && <AlertSection campaign={campaign} />}
              <ProUpgradePrompt
                campaign={campaign}
                user={user}
                pathname={currentPath || undefined}
              />
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </EcanvasserProvider>
    )
  }

  return (
    <EcanvasserProvider>
      <div className="flex min-h-[calc(100vh-56px)] bg-indigo-100 p-2 md:p-4">
        {!hideMenu && (
          <div className="hidden lg:block">
            <DashboardMenu pathname={currentPath} />
          </div>
        )}
        <main
          className={`${!hideMenu ? 'lg:ml-4' : ''} flex-1 ` + wrapperClassName}
        >
          {campaign && showAlert && <AlertSection campaign={campaign} />}
          <ProUpgradePrompt
            campaign={campaign}
            user={user}
            pathname={currentPath || undefined}
          />
          {children}
        </main>
      </div>
    </EcanvasserProvider>
  )
}

const MobileMenuTrigger = () => {
  const { setOpenMobile, openMobile } = useSidebar()
  return (
    <>
      <div className="flex md:hidden items-center justify-between h-16 px-4 bg-sidebar border-b border-sidebar-border">
        <img
          src="/images/logo/heart.svg"
          alt="GoodParty.org"
          className="h-6 w-8 object-contain"
        />
        <button
          onClick={() => setOpenMobile(true)}
          className="flex items-center justify-center rounded-full size-9"
          aria-label="Open menu"
        >
          <MdMenu size={16} />
        </button>
      </div>
      {openMobile && (
        <button
          onClick={() => setOpenMobile(false)}
          className="fixed z-[60] top-4 right-4 flex items-center justify-center size-10 rounded-full bg-white shadow-md"
          aria-label="Close menu"
        >
          <MdClose size={16} />
        </button>
      )}
    </>
  )
}

export default DashboardLayout
