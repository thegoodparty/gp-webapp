'use client'
import Link from 'next/link'
import { KeyboardEvent } from 'react'
import { handleLogOut } from '@shared/user/handleLogOut'
import {
  MdAccountCircle,
  MdAutoAwesome,
  MdFactCheck,
  MdFileOpen,
  MdFolderShared,
  MdAdd,
  MdClose,
  MdLogout,
  MdMessage,
  MdPeople,
  MdPoll,
  MdSensorDoor,
  MdSettings,
  MdWeb,
} from 'react-icons/md'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { useEcanvasser } from '@shared/hooks/useEcanvasser'
import { useEffect, useMemo } from 'react'
import { syncEcanvasser } from 'utils/syncEcanvasser'
import Image from 'next/image'
import { useUser } from '@shared/hooks/useUser'
import { useFlagOn } from '@shared/experiments/FeatureFlagsProvider'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useElectedOffice } from '@shared/hooks/useElectedOffice'
import { Campaign } from 'helpers/types'
import {
  Avatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from 'goodparty-styleguide'
import { FaTheaterMasks, FaUserCircle } from 'react-icons/fa'
import { HiOutlineStar } from 'react-icons/hi'
import { useImpersonateUser } from '@shared/hooks/useImpersonateUser'
import { USER_ROLES, userHasRole, userIsAdmin } from 'helpers/userHelper'
import { MdUnfoldMore } from 'react-icons/md'

interface MenuItem {
  id: string
  label: string
  link: string
  icon: React.ReactNode
  onClick?: () => void
  target?: string
  isNew?: boolean
}

interface ElectedOffice {
  id: string
  isActive: boolean
}

const VOTER_DATA_UPGRADE_ITEM: MenuItem = {
  label: 'Voter Data',
  icon: <MdFolderShared size={18} />,
  link: '/dashboard/upgrade-to-pro',
  id: 'upgrade-pro-dashboard',
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: <MdFactCheck size={18} />,
    link: '/dashboard',
    id: 'campaign-tracker-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickDashboard),
  },
  {
    label: 'Voter Outreach',
    icon: <MdMessage size={18} />,
    link: '/dashboard/outreach',
    id: 'outreach-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickVoterOutreach),
  },
  VOTER_DATA_UPGRADE_ITEM,
  {
    label: 'Website',
    icon: <MdWeb size={18} />,
    link: '/dashboard/website',
    id: 'website-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickWebsite),
  },
  {
    label: 'My Profile',
    icon: <MdAccountCircle size={18} />,
    link: '/dashboard/campaign-details',
    id: 'campaign-details-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickMyProfile),
  },
  {
    label: 'AI Assistant',
    icon: <MdAutoAwesome size={18} />,
    link: '/dashboard/campaign-assistant',
    id: 'campaign-assistant-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickAIAssistant),
  },
  {
    label: 'Content Builder',
    icon: <MdFileOpen size={18} />,
    link: '/dashboard/content',
    id: 'my-content-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickContentBuilder),
  },

  {
    label: 'Community',
    icon: (
      <Image
        src="/images/logo/heart.svg"
        alt="Community"
        width={18}
        height={18}
      />
    ),
    link: 'https://goodpartyorg.circle.so/join?invitation_token=ee5c167c12e1335125a5c8dce7c493e95032deb7-a58159ab-64c4-422a-9396-b6925c225952',
    target: '_blank',
    id: 'community-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickCommunity),
  },
]

const VOTER_RECORDS_MENU_ITEM: MenuItem = {
  id: 'voter-records-dashboard',
  label: 'Voter Data',
  link: '/dashboard/voter-records',
  icon: <MdFolderShared size={18} />,
  onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickVoterData),
}

const ECANVASSER_MENU_ITEM: MenuItem = {
  id: 'door-knocking-dashboard',
  label: 'Door Knocking',
  link: '/dashboard/door-knocking',
  icon: <MdSensorDoor size={18} />,
  onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickDoorKnocking),
}

const CONTACTS_MENU_ITEM: MenuItem = {
  id: 'contacts-dashboard',
  label: 'Contacts',
  link: '/dashboard/contacts',
  icon: <MdPeople size={18} />,
  onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickContacts),
}

const POLLS_MENU_ITEM: MenuItem = {
  id: 'polls-dashboard',
  label: 'Polls',
  link: '/dashboard/polls',
  icon: <MdPoll size={18} />,
  onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickPolls),
  isNew: true,
}

const getDashboardMenuItems = (
  campaign: Campaign | null,
  serveAccessEnabled: boolean,
  electedOffice: ElectedOffice | null,
): MenuItem[] => {
  const menuItems = [...DEFAULT_MENU_ITEMS]

  const voterDataIndex = menuItems.indexOf(VOTER_DATA_UPGRADE_ITEM)
  if (serveAccessEnabled && electedOffice) {
    menuItems[voterDataIndex] = CONTACTS_MENU_ITEM
  } else if (campaign?.isPro) {
    menuItems[voterDataIndex] = VOTER_RECORDS_MENU_ITEM
  }
  if (electedOffice) {
    menuItems.splice(voterDataIndex + 1, 0, POLLS_MENU_ITEM)
  }

  return menuItems
}

export default function DashboardMenu({
  pathname,
}: {
  pathname: string | null
}): React.JSX.Element {
  const [user] = useUser()
  const [campaign] = useCampaign()
  const [ecanvasser] = useEcanvasser()
  const { electedOffice } = useElectedOffice()
  const { ready: _flagsReady, on: serveAccessEnabled } =
    useFlagOn('serve-access')
  const {
    clear: clearImpersonation,
    token: impersonateToken,
    user: impersonateUser,
  } = useImpersonateUser()
  const impersonating = impersonateToken && impersonateUser
  const { setOpenMobile, isMobile } = useSidebar()

  const menuItems = useMemo(() => {
    const baseItems = getDashboardMenuItems(
      campaign,
      serveAccessEnabled,
      electedOffice,
    )

    const items = [...baseItems]

    if (ecanvasser) {
      items.push(ECANVASSER_MENU_ITEM)
    }

    return items
  }, [campaign, serveAccessEnabled, ecanvasser, electedOffice])

  useEffect(() => {
    if (campaign && ecanvasser) {
      syncEcanvasser(campaign?.id)
    }
  }, [campaign, ecanvasser])

  const handleEnterPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key == 'Enter') handleLogOut()
  }

  const handleMenuItemClick = (item: MenuItem) => {
    item?.onClick?.()
    setOpenMobile(false)
  }

  console.log({ user })

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setOpenMobile(false)}
          className="fixed top-4 right-4 z-[60] flex items-center justify-center size-10 rounded-full bg-white shadow-md"
          aria-label="Close menu"
        >
          <MdClose size={16} />
        </button>
      )}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const { id, link, icon, label, target, isNew } = item
                const isActive = pathname === link
                return (
                  <SidebarMenuItem key={id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      size="lg"
                      className="text-base"
                    >
                      <Link
                        href={link}
                        id={id}
                        target={target}
                        onClick={() => handleMenuItemClick(item)}
                      >
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                          {icon}
                        </span>
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {isNew && (
                      <SidebarMenuBadge className="bg-blue-500 text-white text-xs font-semibold rounded px-1.5 mt-1">
                        NEW
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="gap-3 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 shrink-0 rounded-lg">
                    <Avatar.Image
                      src={user?.avatar || undefined}
                      alt={user?.name || ''}
                    />
                    <Avatar.Fallback className="rounded-lg">
                      <FaUserCircle className="h-full w-full" />
                    </Avatar.Fallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="truncate text-xs">Manage account</span>
                  </div>
                  <MdUnfoldMore className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <Avatar.Image
                        src={user?.avatar || undefined}
                        alt={user?.name || ''}
                      />
                      <Avatar.Fallback className="rounded-lg">
                        <FaUserCircle className="h-full w-full" />
                      </Avatar.Fallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" id="nav-dash-settings">
                    <MdSettings />
                    Settings
                  </Link>
                </DropdownMenuItem>
                {userHasRole(user, USER_ROLES.SALES) && !impersonating && (
                  <DropdownMenuItem asChild>
                    <Link href="/sales/add-campaign">
                      <MdAdd />
                      Add Campaign
                    </Link>
                  </DropdownMenuItem>
                )}
                {userIsAdmin(user) && !impersonating && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <HiOutlineStar />
                      Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                {impersonating && (
                  <DropdownMenuItem
                    onClick={() => {
                      clearImpersonation()
                      window.location.href = '/admin'
                    }}
                  >
                    <FaTheaterMasks />
                    Stop Impersonating
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogOut}
                  onKeyDown={(e) =>
                    handleEnterPress(
                      e as unknown as KeyboardEvent<HTMLDivElement>,
                    )
                  }
                  id="nav-log-out"
                >
                  <MdLogout />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}
