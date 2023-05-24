import Link from 'next/link';
import { Fragment } from 'react';
import { AiOutlineFlag } from 'react-icons/ai';
import { BsGraphUp, BsPostcardHeart } from 'react-icons/bs';
import { RiBook2Line, RiTeamLine, RiUserHeartLine } from 'react-icons/ri';
import { TbBrain } from 'react-icons/tb';

const pages = [
  { label: 'Campaign Tracker', icon: <AiOutlineFlag />, link: '/dashboard' },
  { label: 'Profile', icon: <RiUserHeartLine />, link: '/dashboard/profile' },
  {
    label: 'Campaign Plan',
    icon: <TbBrain />,
    link: '/dashboard/plan',
    section: 'Strategy',
  },
  { label: 'Campaign Team', icon: <RiTeamLine />, link: '/dashboard/team' },
  { label: 'Funding', icon: <BsGraphUp />, link: '/dashboard/funding' },
  {
    label: 'My Content',
    icon: <BsPostcardHeart />,
    link: '/dashboard/content',
    section: 'Resources',
  },
  {
    label: 'Resources Library',
    icon: <RiBook2Line />,
    link: '/dashboard/resources',
  },
];
export default function DashboardMenu({ pathname, toggleCallback }) {
  return (
    <div className="w-[calc(100vw-16px)] lg:w-60 p-2 bg-primary h-full rounded-2xl text-gray-800">
      {pages.map((page) => (
        <Fragment key={page.label}>
          {page.section && (
            <div className="font-medium text-sm mt-4 px-3">{page.section}</div>
          )}
          <Link
            href={page.link}
            className="no-underline"
            onClick={toggleCallback}
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
    </div>
  );
}
