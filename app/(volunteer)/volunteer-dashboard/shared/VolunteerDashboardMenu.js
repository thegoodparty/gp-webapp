'use client';
import { deleteUserCookies } from 'helpers/cookieHelper';
import Link from 'next/link';
import { Fragment } from 'react';
import { AiOutlineFlag } from 'react-icons/ai';
import { BsGraphUp, BsPostcardHeart } from 'react-icons/bs';
import { GiProgression } from 'react-icons/gi';
import { RiTeamLine, RiDoorOpenLine } from 'react-icons/ri';

let pages = [
  {
    label: 'Dashboard',
    icon: <AiOutlineFlag />,
    link: '/volunteer-dashboard',
    id: 'volunteer-dashboard',
  },
  {
    label: 'Door Knocking',
    icon: <RiDoorOpenLine />,
    link: '/volunteer-dashboard/door-knocking',
    id: 'volunteer-door-knocking',
  },
  {
    label: 'Profile',
    icon: <RiTeamLine />,
    link: '/profile',
    section: 'Manage',
    id: 'volunteer-profile',
  },
  {
    label: 'My Teammates',
    icon: <RiTeamLine />,
    link: '/volunteer-dashboard/team',
    id: 'volunteer-team',
  },
  {
    label: 'Resources Library',
    icon: <RiTeamLine />,
    link: '/volunteer-dashboard/resources',
    section: 'Resources',
    id: 'volunteer-resources',
  },
];
export default function VolunteerDashboardMenu({
  pathname,
  toggleCallback = () => {},
  mobileMode,
  closeCallback = () => {},
}) {
  const handleLogOut = () => {
    deleteUserCookies();
    window.location.replace('/');
  };

  const handleClick = () => {
    toggleCallback();
    closeCallback();
  };

  return (
    <div className="w-full lg:w-60 p-2 bg-primary h-full rounded-2xl text-gray-300">
      {pages.map((page) => (
        <Fragment key={page.label}>
          {page.section && (
            <div className="font-medium text-sm mt-4 px-3">{page.section}</div>
          )}
          <Link
            href={page.link}
            className="no-underline"
            onClick={handleClick}
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
