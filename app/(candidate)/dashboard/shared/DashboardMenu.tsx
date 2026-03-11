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
  DropdownMenuItem as DropdownMenuItemComponent,
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
  SidebarMenuItem as SidebarMenuItemComponent,
  useSidebar,
} from 'goodparty-styleguide'
import { FaExternalLinkAlt, FaTheaterMasks, FaUserCircle } from 'react-icons/fa'
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

interface DashboardMenuProps {
  pathname: string | null
  toggleCallback?: () => void
  mobileMode?: boolean
  useNewNav?: boolean
}

const VOTER_DATA_UPGRADE_ITEM: MenuItem = {
  label: 'Voter Data',
  icon: <MdFolderShared />,
  link: '/dashboard/upgrade-to-pro',
  id: 'upgrade-pro-dashboard',
}

const VOTER_DATA_UPGRADE_ITEM_V2: MenuItem = {
  ...VOTER_DATA_UPGRADE_ITEM,
  icon: <MdFolderShared size={18} />,
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: <MdFactCheck />,
    link: '/dashboard',
    id: 'campaign-tracker-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickDashboard),
  },
  {
    label: 'Voter Outreach',
    icon: <MdMessage />,
    link: '/dashboard/outreach',
    id: 'outreach-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickVoterOutreach),
  },
  VOTER_DATA_UPGRADE_ITEM,
  {
    label: 'Website',
    icon: <MdWeb />,
    link: '/dashboard/website',
    id: 'website-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickWebsite),
  },
  {
    label: 'My Profile',
    icon: <MdAccountCircle />,
    link: '/dashboard/campaign-details',
    id: 'campaign-details-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickMyProfile),
  },
  {
    label: 'AI Assistant',
    icon: <MdAutoAwesome />,
    link: '/dashboard/campaign-assistant',
    id: 'campaign-assistant-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickAIAssistant),
  },
  {
    label: 'Content Builder',
    icon: <MdFileOpen />,
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
    link: 'https://goodpartyorg.circle.so/join?invitation_token=ee5c167c12e1335125a5c8dce7c493e95032deb7-a58159ab-64c4-422a-9396-b6925c225952',
    target: '_blank',
    id: 'community-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickCommunity),
  },
]

const DEFAULT_MENU_ITEMS_V2: MenuItem[] = [
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
  VOTER_DATA_UPGRADE_ITEM_V2,
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
  icon: <MdFolderShared />,
  onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickVoterData),
}

const VOTER_RECORDS_MENU_ITEM_V2: MenuItem = {
  ...VOTER_RECORDS_MENU_ITEM,
  icon: <MdFolderShared size={18} />,
}

const ECANVASSER_MENU_ITEM: MenuItem = {
  id: 'door-knocking-dashboard',
  label: 'Door Knocking',
  link: '/dashboard/door-knocking',
  icon: <MdSensorDoor />,
  onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickDoorKnocking),
}

const ECANVASSER_MENU_ITEM_V2: MenuItem = {
  ...ECANVASSER_MENU_ITEM,
  icon: <MdSensorDoor size={18} />,
}

const CONTACTS_MENU_ITEM: MenuItem = {
  id: 'contacts-dashboard',
  label: 'Contacts',
  link: '/dashboard/contacts',
  icon: <MdPeople />,
  onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickContacts),
}

const CONTACTS_MENU_ITEM_V2: MenuItem = {
  ...CONTACTS_MENU_ITEM,
  icon: <MdPeople size={18} />,
}

const POLLS_MENU_ITEM: MenuItem = {
  id: 'polls-dashboard',
  label: 'Polls',
  link: '/dashboard/polls',
  icon: <MdPoll />,
  onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickPolls),
  isNew: true,
}

const POLLS_MENU_ITEM_V2: MenuItem = {
  ...POLLS_MENU_ITEM,
  icon: <MdPoll size={18} />,
}

const getDashboardMenuItems = (
  campaign: Campaign | null,
  serveAccessEnabled: boolean,
  electedOffice: ElectedOffice | null,
  isV2 = false,
): MenuItem[] => {
  const defaults = isV2 ? DEFAULT_MENU_ITEMS_V2 : DEFAULT_MENU_ITEMS
  const voterUpgrade = isV2
    ? VOTER_DATA_UPGRADE_ITEM_V2
    : VOTER_DATA_UPGRADE_ITEM
  const voterRecords = isV2
    ? VOTER_RECORDS_MENU_ITEM_V2
    : VOTER_RECORDS_MENU_ITEM
  const contacts = isV2 ? CONTACTS_MENU_ITEM_V2 : CONTACTS_MENU_ITEM
  const polls = isV2 ? POLLS_MENU_ITEM_V2 : POLLS_MENU_ITEM

  const menuItems = [...defaults]

  const voterDataIndex = menuItems.indexOf(voterUpgrade)
  if (serveAccessEnabled && electedOffice) {
    menuItems[voterDataIndex] = contacts
  } else if (campaign?.isPro) {
    menuItems[voterDataIndex] = voterRecords
  }
  if (electedOffice) {
    menuItems.splice(voterDataIndex + 1, 0, polls)
  }

  return menuItems
}

export default function DashboardMenu({
  pathname,
  toggleCallback,
  mobileMode,
  useNewNav,
}: DashboardMenuProps): React.JSX.Element {
  const [campaign] = useCampaign()
  const [ecanvasser] = useEcanvasser()
  const { electedOffice } = useElectedOffice()
  const serveAccessEnabled = useFlagOn('serve-access')

  const menuItems = useMemo(() => {
    const baseItems = getDashboardMenuItems(
      campaign,
      serveAccessEnabled,
      electedOffice,
      useNewNav,
    )

    const items = [...baseItems]

    if (ecanvasser) {
      items.push(useNewNav ? ECANVASSER_MENU_ITEM_V2 : ECANVASSER_MENU_ITEM)
    }

    return items
  }, [campaign, serveAccessEnabled, ecanvasser, electedOffice, useNewNav])

  useEffect(() => {
    if (campaign && ecanvasser) {
      syncEcanvasser(campaign?.id)
    }
  }, [campaign, ecanvasser])

  const handleEnterPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key == 'Enter') handleLogOut()
  }

  if (useNewNav) {
    return (
      <NewNavMenu
        menuItems={menuItems}
        pathname={pathname}
        handleEnterPress={handleEnterPress}
      />
    )
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

const NewNavMenu = ({
  menuItems,
  pathname,
  handleEnterPress,
}: {
  menuItems: MenuItem[]
  pathname: string | null
  handleEnterPress: (e: KeyboardEvent<HTMLDivElement>) => void
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
              {menuItems
                .filter((i) => !['My Profile', 'Community'].includes(i.label))
                .map((item) => {
                  const { id, link, icon, label, target, isNew } = item
                  const isActive = pathname === link
                  return (
                    <SidebarMenuItemComponent key={id}>
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
                    </SidebarMenuItemComponent>
                  )
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItemComponent>
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
                <DropdownMenuItemComponent asChild>
                  <Link
                    href="/dashboard/campaign-details"
                    id="nav-dash-profile"
                    onClick={() => {
                      trackEvent(EVENTS.Navigation.Dashboard.ClickMyProfile)
                    }}
                  >
                    <FaUserCircle className="h-full w-full" />
                    Profile
                  </Link>
                </DropdownMenuItemComponent>
                <DropdownMenuItemComponent asChild>
                  <Link href="/profile" id="nav-dash-settings">
                    <MdSettings />
                    Settings
                  </Link>
                </DropdownMenuItemComponent>
                {userHasRole(user, USER_ROLES.SALES) && !impersonating && (
                  <DropdownMenuItemComponent asChild>
                    <Link href="/sales/add-campaign">
                      <MdAdd className="h-full w-full" />
                      Add Campaign
                    </Link>
                  </DropdownMenuItemComponent>
                )}
                {userIsAdmin(user) && !impersonating && (
                  <DropdownMenuItemComponent asChild>
                    <Link href="/admin">
                      <HiOutlineStar className="h-full w-full" />
                      Admin
                    </Link>
                  </DropdownMenuItemComponent>
                )}
                {impersonating && (
                  <DropdownMenuItemComponent
                    onClick={() => {
                      clearImpersonation()
                      window.location.href = '/admin'
                    }}
                  >
                    <FaTheaterMasks className="h-full w-full" />
                    Stop Impersonating
                  </DropdownMenuItemComponent>
                )}
                <DropdownMenuSeparator />

                <DropdownMenuItemComponent asChild>
                  <Link
                    href="https://goodpartyorg.circle.so/join?invitation_token=ee5c167c12e1335125a5c8dce7c493e95032deb7-a58159ab-64c4-422a-9396-b6925c225952"
                    id="nav-dash-community"
                    target="_blank"
                    onClick={() => {
                      trackEvent(EVENTS.Navigation.Dashboard.ClickCommunity)
                    }}
                  >
                    <FaExternalLinkAlt className="h-full w-full" />
                    Community Forum
                  </Link>
                </DropdownMenuItemComponent>
                <DropdownMenuSeparator />
                <DropdownMenuItemComponent
                  onClick={handleLogOut}
                  onKeyDown={(e) =>
                    handleEnterPress(
                      e as unknown as KeyboardEvent<HTMLDivElement>,
                    )
                  }
                  id="nav-log-out"
                >
                  <MdLogout className="h-full w-full" />
                  Logout
                </DropdownMenuItemComponent>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItemComponent>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}
