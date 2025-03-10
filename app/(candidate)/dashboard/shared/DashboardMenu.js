'use client';
import Link from 'next/link';
import { handleLogOut } from '@shared/user/handleLogOut';
import { DashboardMenuItem } from 'app/(candidate)/dashboard/shared/DashboardMenuItem';
import {
  MdAccountCircle,
  MdAutoAwesome,
  MdFactCheck,
  MdFileOpen,
  MdFolderShared,
  MdLibraryBooks,
  MdSensorDoor,
} from 'react-icons/md';
import { trackEvent, EVENTS } from 'helpers/fullStoryHelper';
import { useEcanvasser } from '@shared/hooks/useEcanvasser';

const VOTER_DATA_UPGRADE_ITEM = {
  label: 'Voter Data',
  icon: <MdFolderShared />,
  link: '/dashboard/upgrade-to-pro',
  id: 'upgrade-pro-dashboard',
};

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
];

const VOTER_RECORDS_MENU_ITEM = {
  id: 'voter-records-dashboard',
  label: 'Voter Data',
  link: '/dashboard/voter-records',
  icon: <MdFolderShared />,
  onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickVoterData),
};

const ECANVASSER_MENU_ITEM = {
  id: 'door-knocking-dashboard',
  label: 'Door Knocking',
  link: '/dashboard/door-knocking',
  icon: <MdSensorDoor />,
  onClick: () => trackEvent(EVENTS.Navigation.Dashboard.ClickDoorKnocking),
};

const getDashboardMenuItems = (campaign) => {
  const menuItems = [...DEFAULT_MENU_ITEMS];
  if (campaign?.isPro) {
    const index = menuItems.indexOf(VOTER_DATA_UPGRADE_ITEM);
    menuItems[index] = VOTER_RECORDS_MENU_ITEM;
  }

  return menuItems;
};

export default function DashboardMenu({
  pathname,
  toggleCallback,
  mobileMode,
  campaign,
}) {
  let menuItems = getDashboardMenuItems(campaign);
  const [ecanvasser] = useEcanvasser();
  if (ecanvasser) {
    menuItems.push(ECANVASSER_MENU_ITEM);
  }

  const handleEnterPress = (e) => {
    if (e.key == 'Enter') handleLogOut(e);
  };

  const handleMenuItemClick = (item) => {
    item?.onClick();
    toggleCallback?.();
  };

  return (
    <div className="w-full lg:w-60 p-2 bg-primary-dark h-full rounded-2xl text-gray-300">
      {menuItems.map((item) => {
        const { id, link, icon, label } = item;
        return (
          <DashboardMenuItem
            key={label}
            id={id}
            link={link}
            icon={icon}
            onClick={() => handleMenuItemClick(item)}
            pathname={pathname}
          >
            {label}
          </DashboardMenuItem>
        );
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
  );
}
