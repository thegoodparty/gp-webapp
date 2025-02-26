'use client';
import ServeMenuItem from './ServeMenuItem';
import { MdAccountCircle, MdFactCheck } from 'react-icons/md';

const DEFAULT_MENU_ITEMS = [
  {
    label: 'Dashboard',
    icon: <MdFactCheck />,
    link: '/serve',
    id: 'campaign-tracker-dashboard',
  },
  {
    label: 'My Profile',
    icon: <MdAccountCircle />,
    link: '/serve/profile',
    id: 'campaign-details-dashboard',
  },
];

export default function ServeMenu({ pathname, toggleCallback }) {
  const menuItems = DEFAULT_MENU_ITEMS;

  return (
    <div className="w-full lg:w-60 p-2 bg-primary-dark h-full rounded-2xl text-gray-300">
      {menuItems.map((item) => {
        const { id, link, icon, label } = item;

        return (
          <ServeMenuItem
            key={label}
            id={id}
            link={link}
            icon={icon}
            onClick={toggleCallback}
            pathname={pathname}
          >
            {label}
          </ServeMenuItem>
        );
      })}
    </div>
  );
}
