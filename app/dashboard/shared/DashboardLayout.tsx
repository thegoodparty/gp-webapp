'use client'
import { ReactNode, useEffect } from 'react'
import Link from 'next/link'
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
import { MenuIcon, XMarkIcon } from '@styleguide/components/ui/icons'
import { useOrganization } from '@shared/organization-picker'
import ImpersonationBanner from '@shared/user/ImpersonationBanner'

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
}: DashboardLayoutProps): React.JSX.Element | null => {
  const [user] = useUser()
  const [hookCampaign] = useCampaign()
  const organization = useOrganization()
  const router = useRouter()
  const hookPathname = usePathname()

  const currentPath = pathname || hookPathname
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
          <ImpersonationBanner />
          <div className={`flex-1 p-2 md:p-4 ${wrapperClassName}`}>
            {activeCampaign && showAlert && (
              <AlertSection campaign={activeCampaign} />
            )}
            <ProUpgradePrompt
              campaign={activeCampaign}
              user={user}
              pathname={currentPath || undefined}
              isElectedOffice={!!organization?.electedOfficeId}
            />
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </EcanvasserProvider>
  )
}

const MOBILE_PAGE_TITLES: Array<[string, string]> = [
  ['/dashboard/briefings', 'Briefing Assistant'],
  ['/dashboard/outreach', 'Voter Outreach'],
  ['/dashboard/voter-records', 'Voter Data'],
  ['/dashboard/contacts', 'Contacts'],
  ['/dashboard/polls', 'Polls'],
  ['/dashboard/website', 'Website'],
  ['/dashboard/campaign-details', 'My Profile'],
  ['/dashboard/campaign-assistant', 'AI Assistant'],
  ['/dashboard/content', 'Content Builder'],
  ['/dashboard/door-knocking', 'Door Knocking'],
]

const getMobilePageTitle = (pathname: string | null): string | null => {
  if (!pathname) return null
  for (const [prefix, title] of MOBILE_PAGE_TITLES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return title
  }
  return null
}

const MobileMenuTrigger = () => {
  const { setOpenMobile, openMobile } = useSidebar()
  const pathname = usePathname()
  const pageTitle = getMobilePageTitle(pathname)
  return (
    <>
      <div className="flex lg:hidden items-center justify-between h-16 px-4 bg-sidebar border-b border-sidebar-border">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard" className="shrink-0">
            <img
              src="/images/logo/heart.svg"
              alt="GoodParty.org"
              className="h-6 w-8 object-contain"
            />
          </Link>
          {pageTitle && (
            <h1 className="truncate text-base font-semibold text-foreground">
              {pageTitle}
            </h1>
          )}
        </div>
        <button
          data-testid="mobile-menu-trigger"
          onClick={() => setOpenMobile(true)}
          className="flex items-center justify-center rounded-full size-9"
          aria-label="Open menu"
        >
          <MenuIcon size={20} />
        </button>
      </div>
      {openMobile && (
        <button
          onClick={() => setOpenMobile(false)}
          className="fixed z-[60] top-3 right-3.5 flex items-center justify-center size-10 rounded-full bg-white shadow-md"
          aria-label="Close menu"
        >
          <XMarkIcon size={20} />
        </button>
      )}
    </>
  )
}

export default DashboardLayout
