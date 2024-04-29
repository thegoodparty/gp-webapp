'use client';
import { createContext, useCallback, useEffect, useState } from 'react';
import {
  FaClipboardList,
  FaDiscord,
  FaGraduationCap,
  FaListUl,
  FaPeopleCarry,
  FaRegCalendarCheck,
  FaRegNewspaper,
  FaSearch,
  FaTools,
  FaUserTie,
} from 'react-icons/fa';
import { usePathname } from 'next/navigation';

export const RUN_LINKS = [
  {
    label: 'Campaign tools',
    href: '/run-for-office',
    icon: <FaTools />,
    id: 'nav-campaign-tools',
  },
  {
    label: 'Academy',
    href: '/academy',
    icon: <FaGraduationCap />,
    id: 'nav-academy',
  },
  {
    label: 'Talk to an expert',
    href: '/get-a-demo',
    icon: <FaUserTie />,
    id: 'nav-talk-expert',
  },
  {
    label: 'Product tour',
    href: '/product-tour',
    icon: <FaClipboardList />,
    id: 'nav-tour',
  },
  {
    label: 'Explore offices',
    href: '/elections',
    icon: <FaSearch />,
    id: 'nav-explore-offices',
  },
];
export const COMMUNITY_LINKS = [
  {
    label: 'Volunteer',
    href: '/volunteer',
    icon: <FaPeopleCarry />,
    id: 'nav-volunteer',
  },
  {
    label: 'Info session',
    href: '/info-session',
    icon: <FaRegCalendarCheck />,
    id: 'nav-info-session',
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/invite/goodparty',
    icon: <FaDiscord />,
    id: 'nav-discord',
    external: true,
  },
];
export const RESOURCES_LINKS = [
  {
    label: 'Blog',
    href: '/blog',
    icon: <FaRegNewspaper />,
    id: 'nav-blog',
  },
  {
    label: 'Glossary',
    href: '/political-terms',
    icon: <FaListUl />,
    id: 'nav-glossary',
  },
];
const DROPDOWNS = [
  {
    id: 'nav-candidates',
    label: 'For Candidates',
    links: RUN_LINKS,
  },
  {
    id: 'nav-voters',
    label: 'For Voters',
    links: COMMUNITY_LINKS,
  },
  {
    id: 'nav-resources',
    label: 'Resources',
    links: RESOURCES_LINKS,
  },
];
const INITIAL_OPEN_STATES = Array(DROPDOWNS.length).fill(false);

export const NavContext = createContext({
  dropdowns: DROPDOWNS,
  openStates: INITIAL_OPEN_STATES,
  toggle: () => {},
  closeAll: () => {},
});

export const NavigationProvider = ({ children }) => {
  const [openStates, setOpenStates] = useState(INITIAL_OPEN_STATES);
  const pathname = usePathname();

  const closeAll = useCallback(
    () => setOpenStates(INITIAL_OPEN_STATES),
    [setOpenStates],
  );

  const makeNewOpenStates = (index) => [
    ...openStates.slice(0, index).fill(false),
    !openStates[index],
    ...openStates.slice(index + 1).fill(false),
  ];

  useEffect(closeAll, [pathname]);

  return (
    <NavContext.Provider
      value={{
        dropdowns: DROPDOWNS,
        openStates,
        toggle: (index) => () => {
          setOpenStates(makeNewOpenStates(index));
        },
        closeAll,
      }}
    >
      {children}
    </NavContext.Provider>
  );
};
