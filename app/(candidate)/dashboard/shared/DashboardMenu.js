import { deleteUserCookies } from 'helpers/cookieHelper';
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

let pages = [
  {
    label: 'Campaign Tracker',
    icon: <AiOutlineFlag />,
    link: '/dashboard',
    id: 'campaign-tracker-dashboard',
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
    label: 'Voter Records',
    icon: <GiProgression />,
    link: '/pro-consultation',
    id: 'vote-records-dashboard',
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
export default function DashboardMenu({
  pathname,
  toggleCallback,
  mobileMode,
  user,
  campaign,
}) {
  const handleLogOut = () => {
    deleteUserCookies();
    window.location.replace('/');
  };
  if (user?.isAdmin && pages.length === 8) {
    pages.splice(5, 0, {
      label: 'Door Knocking',
      icon: <RiDoorOpenLine />,
      link: '/dashboard/door-knocking/main',
      id: 'door-knocking-dashboard',
    });
  }
  if (campaign?.hasVoterFile) {
    pages[4].link = '/dashboard/voter-records';
  }
  return (
    <div className="w-full lg:w-60 p-2 bg-primary h-full rounded-2xl text-gray-800">
      {pages.map((page) => (
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
              className={`text-[17px] py-3 px-3 flex items-center rounded-lg transition-colors hover:text-slate-50 hover:bg-indigo-700 ${
                pathname === page.link && 'text-slate-50 bg-indigo-700'
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
              className={`text-[17px] py-3 px-3  rounded-lg transition-colors hover:text-slate-50 hover:bg-indigo-700 `}
            >
              <div className="ml-2">Settings</div>
            </div>
          </Link>

          <div
            className="text-[17px] py-3 px-3  rounded-lg transition-colors hover:text-slate-50 hover:bg-indigo-700 cursor-pointer "
            onClick={handleLogOut}
          >
            <div className="ml-2">Logout</div>
          </div>
        </div>
      )}
    </div>
  );
}
