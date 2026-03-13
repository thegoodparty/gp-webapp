'use client'
import Link from 'next/link'
import { KeyboardEvent } from 'react'
import { handleLogOut } from '@shared/user/handleLogOut'
import { DashboardMenuItem } from 'app/(candidate)/dashboard/shared/DashboardMenuItem'
import {
  MdAccountCircle,
  MdAutoAwesome,
  MdFactCheck,
  MdFileOpen,
  MdFolderShared,
  MdMessage,
  MdPeople,
  MdPoll,
  MdSensorDoor,
  MdWeb,
} from 'react-icons/md'
import {
  Bot,
  Circle,
  CircleUserRound,
  DoorClosed,
  ExternalLink,
  FileText,
  Globe,
  LayoutDashboard,
  LogOut,
  Plus,
  Send,
  Settings,
  StopCircle,
  UserRound,
  UsersRound,
  Wand,
  type LucideIcon,
} from 'lucide-react'
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
  DropdownMenuItem as DropdownMenuItemComponent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem as SidebarMenuItemComponent,
  SidebarSeparator,
  useSidebar,
} from '@styleguide'
import { useImpersonateUser } from '@shared/hooks/useImpersonateUser'
import { USER_ROLES, userHasRole, userIsAdmin } from 'helpers/userHelper'

interface MenuItem {
  id: string
  label: string
  link: string
  icon: React.ReactNode
  v2Icon: LucideIcon
  onClick?: () => void
  target?: string
  isNew?: boolean
}

interface ElectedOffice {
  id: string
  isActive: boolean
}

interface DashboardMenuProps {
  pathname: string | null
  toggleCallback?: () => void
  mobileMode?: boolean
}

const VOTER_DATA_UPGRADE_ITEM: MenuItem = {
  label: 'Voter Data',
  icon: <MdFolderShared />,
  v2Icon: UsersRound,
  link: '/dashboard/upgrade-to-pro',
  id: 'upgrade-pro-dashboard',
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: <MdFactCheck />,
    v2Icon: LayoutDashboard,
    link: '/dashboard',
    id: 'campaign-tracker-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickDashboard),
  },
  {
    label: 'Voter Outreach',
    icon: <MdMessage />,
    v2Icon: Send,
    link: '/dashboard/outreach',
    id: 'outreach-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickVoterOutreach),
  },
  VOTER_DATA_UPGRADE_ITEM,
  {
    label: 'Website',
    icon: <MdWeb />,
    v2Icon: Globe,
    link: '/dashboard/website',
    id: 'website-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickWebsite),
  },
  {
    label: 'My Profile',
    icon: <MdAccountCircle />,
    v2Icon: Circle,
    link: '/dashboard/campaign-details',
    id: 'campaign-details-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickMyProfile),
  },
  {
    label: 'AI Assistant',
    icon: <MdAutoAwesome />,
    v2Icon: Bot,
    link: '/dashboard/campaign-assistant',
    id: 'campaign-assistant-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickAIAssistant),
  },
  {
    label: 'Content Builder',
    icon: <MdFileOpen />,
    v2Icon: FileText,
    link: '/dashboard/content',
    id: 'my-content-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickContentBuilder),
  },

  {
    label: 'Community',
    icon: (
      <Image
        src="/images/logo/heart-white.svg"
        alt="Community"
        width={20}
        height={20}
        className="opacity-70 hover:opacity-100 transition-opacity"
      />
    ),
    v2Icon: Circle,
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
  icon: <MdFolderShared />,
  v2Icon: UsersRound,
  onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickVoterData),
}

const ECANVASSER_MENU_ITEM: MenuItem = {
  id: 'door-knocking-dashboard',
  label: 'Door Knocking',
  link: '/dashboard/door-knocking',
  icon: <MdSensorDoor />,
  v2Icon: DoorClosed,
  onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickDoorKnocking),
}

const CONTACTS_MENU_ITEM: MenuItem = {
  id: 'contacts-dashboard',
  label: 'Contacts',
  link: '/dashboard/contacts',
  icon: <MdPeople />,
  v2Icon: UsersRound,
  onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickContacts),
}

const POLLS_MENU_ITEM: MenuItem = {
  id: 'polls-dashboard',
  label: 'Polls',
  link: '/dashboard/polls',
  icon: <MdPoll />,
  v2Icon: Send,
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
  toggleCallback,
  mobileMode,
}: DashboardMenuProps): React.JSX.Element {
  const [campaign] = useCampaign()
  const [ecanvasser] = useEcanvasser()
  const { electedOffice } = useElectedOffice()
  const { ready: _flagsReady, on: serveAccessEnabled } =
    useFlagOn('serve-access')

  const menuItems = useMemo(() => {
    const items = getDashboardMenuItems(
      campaign,
      serveAccessEnabled,
      electedOffice,
    )

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

  const { on: useNewNav } = useFlagOn('win-serve-split')

  if (useNewNav) {
    return <NewNavMenu menuItems={menuItems} pathname={pathname} />
  }

  const handleMenuItemClick = (item: MenuItem) => {
    item?.onClick?.()
    toggleCallback?.()
  }

  return (
    <div className="w-full lg:w-60 p-2 bg-primary-dark h-full rounded-2xl text-gray-300 leading-[1.3]">
      {menuItems.map((item) => {
        const { id, link, icon, label, target, isNew } = item
        return (
          <DashboardMenuItem
            key={label}
            id={id}
            link={link}
            icon={icon}
            onClick={() => handleMenuItemClick(item)}
            pathname={pathname || ''}
            target={target}
            isNew={isNew}
          >
            {label}
          </DashboardMenuItem>
        )
      })}
      {mobileMode && (
        <div className="mt-4 border-t border-indigo-400 pt-4">
          <Link
            href="/profile"
            className="no-underline block text-[17px] py-3 px-3 rounded-lg transition-colors hover:text-slate-50 hover:bg-primary-dark-dark"
            id="nav-dash-settings"
          >
            <div className="ml-2">Settings</div>
          </Link>

          <div
            role="link"
            tabIndex={0}
            className="block text-[17px] py-3 px-3 rounded-lg transition-colors hover:text-slate-50 hover:bg-primary-dark-dark cursor-pointer"
            onClick={handleLogOut}
            onKeyDown={(e) => handleEnterPress(e)}
          >
            <div id="nav-log-out" className="ml-2">
              Logout
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

type AccountManagementItem = {
  label: string
  icon: LucideIcon
  id: string
  href: string
  onClick?: () => void
  _target?: string
}

const NewNavMenu = ({
  menuItems,
  pathname,
}: {
  menuItems: MenuItem[]
  pathname: string | null
}) => {
  const [user] = useUser()
  const {
    clear: clearImpersonation,
    token: impersonateToken,
    user: impersonateUser,
  } = useImpersonateUser()
  const impersonating = impersonateToken && impersonateUser
  const { setOpenMobile, isMobile } = useSidebar()

  const handleMenuItemClick = (item: MenuItem) => {
    item?.onClick?.()
    setOpenMobile(false)
  }

  const accountManagementMenuItems = {
    profile: {
      label: 'Profile',
      icon: CircleUserRound,
      id: 'nav-dash-profile',
      href: '/dashboard/campaign-details',
      onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickMyProfile),
    },
    settings: {
      label: 'Settings',
      icon: Settings,
      id: 'nav-dash-settings',
      href: '/profile',
    },
    addCampaign: {
      label: 'Add Campaign',
      icon: Plus,
      id: 'nav-dash-add-campaign',
      href: '/sales/add-campaign',
    },
    admin: {
      label: 'Admin',
      icon: Wand,
      id: 'nav-dash-admin',
      href: '/admin',
    },
    stopImpersonating: {
      label: 'Stop Impersonating',
      icon: StopCircle,
      id: 'nav-dash-stop-impersonating',
      href: '/admin',
      onClick: () => {
        clearImpersonation()
        window.location.href = '/admin'
      },
    },
    community: {
      label: 'Community Forum',
      icon: ExternalLink,
      id: 'nav-dash-community',
      href: 'https://goodpartyorg.circle.so/join?invitation_token=ee5c167c12e1335125a5c8dce7c493e95032deb7-a58159ab-64c4-422a-9396-b6925c225952',
      _target: '_blank',
    },
    logout: {
      label: 'Logout',
      icon: LogOut,
      id: 'nav-log-out',
      href: '/logout',
      _target: '_self',
    },
  } satisfies Record<string, AccountManagementItem>

  const sidebarItem = (item: AccountManagementItem) => (
    <SidebarMenuItemComponent key={item.id}>
      <SidebarMenuButton
        asChild
        isActive={pathname === item.href}
        className="px-4 py-2.5 h-10 text-sm gap-2 rounded-md font-opensans"
      >
        <Link
          href={item.href}
          id={item.id}
          target={item._target}
          onClick={() => {
            item.onClick?.()
            setOpenMobile(false)
          }}
        >
          <item.icon size={16} />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItemComponent>
  )

  const dropDownItem = (item: AccountManagementItem) => (
    <DropdownMenuItemComponent asChild className="h-10">
      <Link
        href={item.href}
        id={item.id}
        target={item._target}
        onClick={() => {
          item.onClick?.()
        }}
      >
        <item.icon size={16} className="text-foreground" />
        <span>{item.label}</span>
      </Link>
    </DropdownMenuItemComponent>
  )

  return (
    <>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems
                .filter((i) => !['My Profile', 'Community'].includes(i.label))
                .map((item) => {
                  const {
                    id,
                    link,
                    label,
                    target,
                    isNew,
                    v2Icon: V2Icon,
                  } = item
                  return (
                    <SidebarMenuItemComponent key={id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === link}
                        className="px-4 py-2.5 h-10 text-sm gap-2 rounded-md font-opensans"
                      >
                        <Link
                          href={link}
                          id={id}
                          target={target}
                          onClick={() => handleMenuItemClick(item)}
                        >
                          {V2Icon && <V2Icon size={16} />}
                          <span>{label}</span>
                        </Link>
                      </SidebarMenuButton>
                      {isNew && (
                        <SidebarMenuBadge className="bg-blue-500 text-white text-xs font-semibold rounded px-1.5">
                          NEW
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItemComponent>
                  )
                })}
              {isMobile && (
                <>
                  <SidebarSeparator />
                  {sidebarItem(accountManagementMenuItems.community)}
                  <SidebarSeparator />
                  {sidebarItem(accountManagementMenuItems.profile)}
                  {sidebarItem(accountManagementMenuItems.settings)}
                  {userHasRole(user, USER_ROLES.SALES) &&
                    !impersonating &&
                    sidebarItem(accountManagementMenuItems.addCampaign)}
                  {userIsAdmin(user) &&
                    !impersonating &&
                    sidebarItem(accountManagementMenuItems.admin)}
                  {!!impersonating &&
                    sidebarItem(accountManagementMenuItems.stopImpersonating)}
                  <SidebarSeparator />
                  {sidebarItem(accountManagementMenuItems.logout)}
                  <SidebarSeparator />
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {!isMobile && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItemComponent>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="h-auto gap-2 p-2 font-opensans data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <Avatar className="size-8 shrink-0 rounded-lg border border-border">
                      <Avatar.Image src={user?.avatar || undefined} />
                      <Avatar.Fallback className="rounded-lg bg-white">
                        <UserRound className="size-5 text-muted-foreground" />
                      </Avatar.Fallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col gap-0.5 min-w-0 leading-none text-left">
                      <span className="truncate text-sm font-semibold">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <span className="truncate text-xs">Manage account</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="min-w-56 rounded-lg font-opensans"
                  side={isMobile ? 'bottom' : 'right'}
                  align="end"
                  sideOffset={4}
                >
                  {dropDownItem(accountManagementMenuItems.profile)}
                  {dropDownItem(accountManagementMenuItems.settings)}
                  {userHasRole(user, USER_ROLES.SALES) &&
                    !impersonating &&
                    dropDownItem(accountManagementMenuItems.addCampaign)}
                  {userIsAdmin(user) &&
                    !impersonating &&
                    dropDownItem(accountManagementMenuItems.admin)}
                  {!!impersonating &&
                    dropDownItem(accountManagementMenuItems.stopImpersonating)}
                  <DropdownMenuSeparator />
                  {dropDownItem(accountManagementMenuItems.community)}
                  <DropdownMenuSeparator />
                  {dropDownItem(accountManagementMenuItems.logout)}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItemComponent>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </>
  )
}
