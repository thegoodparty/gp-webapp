'use client';

import { useCallback, useState } from 'react';
import NavDropdown from './NavDropdown';
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
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Link from 'next/link';
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

export default function LeftSide() {
  const [runOpen, setRunOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const pathname = usePathname();
  const isOnboardingPath = pathname?.startsWith('/onboarding');
  const isDashboardPath =
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/volunteer-dashboard');

  const closeAll = () => {
    setRunOpen(false);
    setCommunityOpen(false);
    setResourcesOpen(false);
  };

  const toggleRun = useCallback(() => {
    closeAll();
    setRunOpen(!runOpen);
  }, [runOpen]);

  const toggleCommunity = useCallback(() => {
    closeAll();
    setCommunityOpen(!communityOpen);
  }, [communityOpen]);

  const toggleResources = useCallback(() => {
    closeAll();
    setResourcesOpen(!resourcesOpen);
  }, [resourcesOpen]);

  if (isOnboardingPath || isDashboardPath) {
    return null;
  }

  return (
    <div className="items-center hidden lg:flex">
      <NavDropdown
        open={runOpen}
        toggleCallback={toggleRun}
        links={RUN_LINKS}
        label="For Candidates"
        id="nav-candidates"
      />
      <NavDropdown
        open={communityOpen}
        toggleCallback={toggleCommunity}
        links={COMMUNITY_LINKS}
        label="For Voters"
        id="nav-voters"
      />
      <NavDropdown
        open={resourcesOpen}
        toggleCallback={toggleResources}
        links={RESOURCES_LINKS}
        label="Resources"
        id="nav-resources"
      />
      <Link href="/about" id="nav-mission" className="ml-6">
        <PrimaryButton variant="text" size="medium">
          <div className="font-medium text-base">Our Mission</div>
        </PrimaryButton>
      </Link>
    </div>
  );
}
