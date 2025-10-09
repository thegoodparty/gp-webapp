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
  MdPeople,
  MdPoll,
  MdSensorDoor,
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

const CONTACTS_MENU_ITEM = {
  id: 'contacts-dashboard',
  label: 'Contacts',
  link: '/dashboard/contacts',
  icon: <MdPeople />,
  onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickContacts),
}

const POLLS_MENU_ITEM = {
  id: 'polls-dashboard',
  label: 'Polls',
  link: '/dashboard/polls',
  icon: <MdPoll />,
  onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickPolls),
}

const getDashboardMenuItems = (
  campaign,
  serveAccessEnabled,
  pollsAccessEnabled,
) => {
  const menuItems = [...DEFAULT_MENU_ITEMS]

  const voterDataIndex = menuItems.indexOf(VOTER_DATA_UPGRADE_ITEM)
  if (serveAccessEnabled) {
    menuItems[voterDataIndex] = CONTACTS_MENU_ITEM
  } else if (campaign?.isPro) {
    menuItems[voterDataIndex] = VOTER_RECORDS_MENU_ITEM
  }
  if (pollsAccessEnabled) {
    const pollsIndex = menuItems.indexOf(CONTACTS_MENU_ITEM)
    menuItems.splice(pollsIndex + 1, 0, POLLS_MENU_ITEM)
  }

  return menuItems
}

export default function DashboardMenu({
  pathname,
  toggleCallback,
  mobileMode,
}) {
  const [user] = useUser()
  const [campaign] = useCampaign()
  const [ecanvasser] = useEcanvasser()
  const { ready: flagsReady, on: serveAccessEnabled } =
    useFlagOn('serve-access')

  const { ready: pollFlagsReady, on: pollsAccessEnabled } =
    useFlagOn('serve-polls-v1')

  const menuItems = useMemo(() => {
    const baseItems = getDashboardMenuItems(
      campaign,
      serveAccessEnabled,
      pollsAccessEnabled,
    )

    const items = [...baseItems]

    if (ecanvasser) {
      items.push(ECANVASSER_MENU_ITEM)
    }

    return items
  }, [campaign, serveAccessEnabled, ecanvasser, user, pollsAccessEnabled])

  useEffect(() => {
    if (campaign && ecanvasser) {
      syncEcanvasser(campaign?.id)
    }
  }, [campaign, ecanvasser])

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
