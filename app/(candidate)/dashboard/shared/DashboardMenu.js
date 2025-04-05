'use client'
import Link from 'next/link'
import { handleLogOut } from '@shared/user/handleLogOut'
import { DashboardMenuItem } from 'app/(candidate)/dashboard/shared/DashboardMenuItem'
import {
  MdAccountCircle,
  MdAutoAwesome,
  MdFactCheck,
  MdFileOpen,
  MdFolderShared,
  MdLibraryBooks,
  MdMessage,
  MdSensorDoor,
} from 'react-icons/md'
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper'
import { useEcanvasser } from '@shared/hooks/useEcanvasser'
import { useEffect } from 'react'
import { syncEcanvasser } from 'utils/syncEcanvasser'
import { userIsAdmin } from 'helpers/userHelper'
import Image from 'next/image'
import { useUser } from '@shared/hooks/useUser'

const VOTER_DATA_UPGRADE_ITEM = {
  label: 'Voter Data',
  icon: <MdFolderShared />,
  link: '/dashboard/upgrade-to-pro',
  id: 'upgrade-pro-dashboard',
}

const DEFAULT_MENU_ITEMS = [
  {
    label: 'Dashboard',
    icon: <MdFactCheck />,
    link: '/dashboard',
    id: 'campaign-tracker-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickDashboard),
  },
  {
    label: 'AI Assistant',
    icon: <MdAutoAwesome />,
    link: '/dashboard/campaign-assistant',
    id: 'campaign-assistant-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickAIAssistant),
  },
  VOTER_DATA_UPGRADE_ITEM,
  {
    label: 'Content Builder',
    icon: <MdFileOpen />,
    link: '/dashboard/content',
    id: 'my-content-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickContentBuilder),
  },
  {
    label: 'My Profile',
    icon: <MdAccountCircle />,
    link: '/dashboard/campaign-details',
    id: 'campaign-details-dashboard',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickMyProfile),
  },
  {
    label: 'Free Resources',
    icon: <MdLibraryBooks />,
    link: '/blog/section/for-candidates',
    id: 'resources-library',
    onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickFreeResources),
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

const VOTER_RECORDS_MENU_ITEM = {
  id: 'voter-records-dashboard',
  label: 'Voter Data',
  link: '/dashboard/voter-records',
  icon: <MdFolderShared />,
  onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickVoterData),
}

const ECANVASSER_MENU_ITEM = {
  id: 'door-knocking-dashboard',
  label: 'Door Knocking',
  link: '/dashboard/door-knocking',
  icon: <MdSensorDoor />,
  onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickDoorKnocking),
}

// admin user only
const TEXTING_MENU_ITEM = {
  id: 'text-messaging-dashboard',
  label: 'Text Messaging',
  link: '/dashboard/text-messaging',
  icon: <MdMessage />,
  onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickTextMessaging),
}

const getDashboardMenuItems = (campaign) => {
  const menuItems = [...DEFAULT_MENU_ITEMS]
  if (campaign?.isPro) {
    const index = menuItems.indexOf(VOTER_DATA_UPGRADE_ITEM)
    menuItems[index] = VOTER_RECORDS_MENU_ITEM
  }

  return menuItems
}

export default function DashboardMenu({
  pathname,
  toggleCallback,
  mobileMode,
  campaign,
}) {
  let menuItems = getDashboardMenuItems(campaign)
  const [user] = useUser()
  const [ecanvasser] = useEcanvasser()
  if (ecanvasser) {
    menuItems.push(ECANVASSER_MENU_ITEM)
  }
  useEffect(() => {
    if (campaign && ecanvasser) {
      syncEcanvasser(campaign?.id)
    }
  }, [campaign, ecanvasser])
  if (userIsAdmin(user)) {
    menuItems.push(TEXTING_MENU_ITEM)
  }

  const handleEnterPress = (e) => {
    if (e.key == 'Enter') handleLogOut(e)
  }

  const handleMenuItemClick = (item) => {
    item?.onClick?.()
    toggleCallback?.()
  }

  return (
    <div className="w-full lg:w-60 p-2 bg-primary-dark h-full rounded-2xl text-gray-300">
      {menuItems.map((item) => {
        const { id, link, icon, label, target } = item
        return (
          <DashboardMenuItem
            key={label}
            id={id}
            link={link}
            icon={icon}
            onClick={() => handleMenuItemClick(item)}
            pathname={pathname}
            target={target}
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
