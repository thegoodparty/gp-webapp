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
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  useSidebar,
} from 'goodparty-styleguide'
import { MdChevronLeft, MdChevronRight, MdMenu } from 'react-icons/md'
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
  const navRefreshEnabled = useFlagOn('win-serve-split')

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

  const menuPathname = pathname || hookPathname

  if (navRefreshEnabled) {
    return (
      <EcanvasserProvider>
        <SidebarProvider
          style={
            {
              '--sidebar-width': '16rem',
              '--sidebar-width-icon': '4rem',
            } as React.CSSProperties
          }
        >
          {!hideMenu && (
            <>
              <Sidebar collapsible="icon">
                <DashboardMenu pathname={menuPathname} useNewNav />
                <SidebarRail />
              </Sidebar>
              <MobileMenuTrigger />
              <DesktopCollapseTrigger />
            </>
          )}
          <SidebarInset className="bg-indigo-100">
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
            <DashboardMenu pathname={menuPathname} />
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

const DesktopCollapseTrigger = () => {
  const { toggleSidebar, state } = useSidebar()
  return (
    <button
      onClick={toggleSidebar}
      className="hidden md:flex fixed bottom-4 z-50 items-center justify-center size-8 rounded-full bg-white border border-zinc-200 shadow-sm hover:bg-zinc-50 transition-[left] duration-200"
      style={{
        left:
          state === 'collapsed'
            ? 'calc(var(--sidebar-width-icon) - 1rem)'
            : 'calc(var(--sidebar-width) - 1rem)',
      }}
      aria-label={state === 'collapsed' ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {state === 'collapsed' ? (
        <MdChevronRight size={16} />
      ) : (
        <MdChevronLeft size={16} />
      )}
    </button>
  )
}

const MobileMenuTrigger = () => {
  const { setOpenMobile } = useSidebar()
  return (
    <button
      onClick={() => setOpenMobile(true)}
      className="fixed top-3 right-4 z-50 flex items-center justify-center rounded-full size-9 md:hidden"
      aria-label="Open menu"
    >
      <MdMenu size={20} />
    </button>
  )
}

export default DashboardLayout
