'use client';
import Link from 'next/link';
import { AiOutlineFlag } from 'react-icons/ai';
import { BsGraphUp, BsPostcardHeart, BsStars } from 'react-icons/bs';
import { GiProgression } from 'react-icons/gi';
import {
  RiBook2Line,
  RiDoorOpenLine,
  RiTeamLine,
  RiUserHeartLine,
} from 'react-icons/ri';
import { TbBrain } from 'react-icons/tb';
import { handleLogOut } from '@shared/user/handleLogOut';
import useNotifications from '@shared/layouts/navigation/notifications/useNotifications';
import { DashboardMenuItem } from 'app/(candidate)/dashboard/shared/DashboardMenuItem';

const CAMPAIGN_TEAM_MENU_ITEM = {
  label: 'Campaign Team',
  icon: <RiTeamLine />,
  link: '/dashboard/team',
  section: 'Strategy',
  id: 'campaign-team-dashboard',
};

const VOTER_DATA_UPGRADE_ITEM = {
  label: 'Voter Data',
  icon: <GiProgression />,
  link: '/dashboard/upgrade-to-pro',
  id: 'upgrade-pro-dashboard',
};

const DEFAULT_MENU_ITEMS = [
  {
    label: 'Campaign Tracker',
    icon: <AiOutlineFlag />,
    link: '/dashboard',
    id: 'campaign-tracker-dashboard',
  },
  {
    label: 'Campaign Assistant',
    icon: <BsStars />,
    link: '/dashboard/campaign-assistant',
    id: 'campaign-assistant-dashboard',
  },
  VOTER_DATA_UPGRADE_ITEM,
  {
    label: 'AI Campaign Plan',
    icon: <TbBrain />,
    link: '/dashboard/plan',
    id: 'campaign-plan-dashboard',
  },
  {
    label: 'AI Campaign Tool',
    icon: <BsPostcardHeart />,
    link: '/dashboard/content',
    id: 'my-content-dashboard',
  },
  {
    label: 'Campaign Details',
    icon: <RiUserHeartLine />,
    link: '/dashboard/campaign-details',
    id: 'campaign-details-dashboard',
  },

  CAMPAIGN_TEAM_MENU_ITEM,
  {
    label: 'Resources Library',
    icon: <RiBook2Line />,
    link: '/dashboard/resources',
    section: 'Resources',
    id: 'resources-library',
  },
];

const VOTER_RECORDS_MENU_ITEM = {
  id: 'voter-records-dashboard',
  label: 'Voter Data',
  link: '/dashboard/voter-records',
  icon: <GiProgression />,
};

const getDashboardMenuItems = (campaign, user) => {
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
  user,
  campaign,
}) {
  const notifications = useNotifications() || [];
  const campaignRequestNotifications = notifications.filter((notification) => {
    const { data = {}, isRead } = notification || {};
    const { type } = data;
    return type === 'campaignRequest' && !isRead;
  });
  const menuItems = getDashboardMenuItems(campaign, user);

  const handleEnterPress = (e) => {
    if (e.key == 'Enter') handleLogOut(e);
  };

  return (
    <div className="w-full lg:w-60 p-2 bg-primary-dark h-full rounded-2xl text-gray-300">
      {menuItems.map((item) => {
        const { id, link, section, icon, label } = item;
        const notificationDot =
          Boolean(campaignRequestNotifications?.length) &&
          item === CAMPAIGN_TEAM_MENU_ITEM;
        return (
          <DashboardMenuItem
            key={label}
            id={id}
            section={section}
            link={link}
            icon={icon}
            onClick={toggleCallback}
            pathname={pathname}
            notificationDot={notificationDot}
          >
            {label}
          </DashboardMenuItem>
        );
      })}
      {mobileMode && (
        <div className="mt-4 border-t border-indigo-400 pt-4">
          <Link
            href="/profile"
            className="no-underline block block text-[17px] py-3 px-3 rounded-lg transition-colors hover:text-slate-50 hover:bg-primary-dark-dark"
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
