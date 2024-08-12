import Link from 'next/link';
import { Fragment } from 'react';
import { AiOutlineFlag } from 'react-icons/ai';
import { BsGraphUp, BsPostcardHeart } from 'react-icons/bs';
import { GiProgression } from 'react-icons/gi';
import {
  RiBook2Line,
  RiTeamLine,
  RiUserHeartLine,
  RiDoorOpenLine,
} from 'react-icons/ri';
import { TbBrain } from 'react-icons/tb';
import { handleLogOut } from '@shared/user/handleLogOut';

const DEFAULT_MENU_ITEMS = [
  {
    label: 'Campaign Tracker',
    icon: <AiOutlineFlag />,
    link: '/dashboard',
    id: 'campaign-tracker-dashboard',
  },
  {
    label: 'Upgrade to Pro',
    icon: <GiProgression />,
    link: '/dashboard/upgrade-to-pro',
    id: 'upgrade-pro-dashboard',
  },
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
    label: 'My Details',
    icon: <RiUserHeartLine />,
    link: '/dashboard/details',
    id: 'details-dashboard',
  },

  {
    label: 'Campaign Team',
    icon: <RiTeamLine />,
    link: '/dashboard/team',
    section: 'Strategy',
    id: 'campaign-team-dashboard',
  },
  {
    label: 'Funding',
    icon: <BsGraphUp />,
    link: '/dashboard/funding',
    id: 'funding-dashboard',
  },
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
  label: 'Voter Records',
  link: '/dashboard/voter-records',
  icon: <GiProgression />,
};

const DOOR_KNOCKING_MENU_ITEM = {
  label: 'Door Knocking',
  icon: <RiDoorOpenLine />,
  link: '/dashboard/door-knocking/main',
  id: 'door-knocking-dashboard',
};

const getDashboardMenuItems = (campaign, user) => {
  const menuItems = [...DEFAULT_MENU_ITEMS];
  if (campaign?.isPro) {
    menuItems[1] = VOTER_RECORDS_MENU_ITEM;
  }
  if (user?.isAdmin) {
    menuItems.splice(5, 0, DOOR_KNOCKING_MENU_ITEM);
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
  const menuItems = getDashboardMenuItems(campaign, user);

  return (
    <div className="w-full lg:w-60 p-2 bg-primary-dark h-full rounded-2xl text-gray-300">
      {menuItems.map((page) => (
        <Fragment key={page.label}>
          {page.section && (
            <div className="font-medium text-sm mt-4 px-3">{page.section}</div>
          )}
          <Link
            href={page.link}
            className="no-underline"
            onClick={toggleCallback}
            id={page.id}
          >
            <div
              className={`text-[17px] py-3 px-3 flex items-center rounded-lg transition-colors hover:text-slate-50 hover:bg-primary-dark-dark ${
                pathname === page.link && 'text-slate-50 bg-primary-dark-dark'
              }`}
            >
              {page.icon}
              <div className="ml-2">{page.label}</div>
            </div>
          </Link>
        </Fragment>
      ))}
      {mobileMode && (
        <div className="mt-4 border-t border-indigo-400 pt-4">
          <Link href="/profile" className="no-underline" id="nav-dash-settings">
            <div
              className={`text-[17px] py-3 px-3  rounded-lg transition-colors hover:text-slate-50 hover:bg-primary-dark-dark `}
            >
              <div className="ml-2">Settings</div>
            </div>
          </Link>

          <div
            className="text-[17px] py-3 px-3  rounded-lg transition-colors hover:text-slate-50 hover:bg-primary-dark-dark cursor-pointer"
            onClick={handleLogOut}
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
