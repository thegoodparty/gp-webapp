'use client';
import Hamburger from '@shared/utils/Hamburger';
import { useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Caption from '@shared/typography/Caption';
import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import H3 from '@shared/typography/H3';
import DashboardMobile from '../DashboardMobile';
import {
  COMMUNITY_LINKS,
  RESOURCES_LINKS,
  RUN_LINKS,
} from '@shared/layouts/navigation/NavigationProvider';
import { useUser } from '@shared/hooks/useUser';
import { useCampaignStatus } from '@shared/hooks/useCampaignStatus';
import { ExitToDashboardButton } from '@shared/layouts/navigation/ExitToDashboardButton';
import Button from '@shared/buttons/Button';
import { useCampaign } from '@shared/hooks/useCampaign';

// TODO: define these labels in the same place as we do the larger-screen navigation sections
const sections = [
  { title: 'For Candidates', links: RUN_LINKS },
  { title: 'For Voters', links: COMMUNITY_LINKS },
  { title: 'Resources', links: RESOURCES_LINKS },
];

export default function RightSideMobile() {
  const [isOpen, setOpen] = useState(false);
  const [user] = useUser();
  const [campaignStatus] = useCampaignStatus();
  const [campaign] = useCampaign();
  const { status, step, slug } = campaignStatus || {};
  const pathname = usePathname();
  const isDashboardPath =
    pathname?.startsWith('/dashboard') || pathname?.startsWith('/profile');
  let dashboardLink = '/dashboard';

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <div className="lg:hidden">
      <div>
        <div
          className={`z-[1300] fixed top-1 right-0 flex items-center ${
            isOpen ? 'text-white' : ''
          }`}
        >
          {!isOpen && user && (
            <>
              <ExitToDashboardButton />
              <div>
              </div>
            </>
          )}
          <Hamburger
            hideOutline={false}
            toggled={isOpen}
            toggle={setOpen}
            size={24}
            rounded
          />
        </div>
        <SwipeableDrawer
          open={isOpen}
          onClose={() => setOpen(false)}
          anchor="right"
          onOpen={() => {}}
        >
          {user && isDashboardPath ? (
            <DashboardMobile user={user} pathname={pathname} campaign={campaign} />
          ) : (
            <div className="flex flex-col w-[270px] bg-primary-dark text-white h-screen relative">
              <div
                className={`grow overflow-auto px-4 pt-24 ${
                  user ? 'pb-36' : 'pb-60'
                }`}
              >
                {user && (
                  <H3 className="mb-8">
                    {user.firstName} {user.lastName}
                  </H3>
                )}
                {sections.map((section) => (
                  <div
                    key={section.title}
                    className="border-b border-indigo-400 pb-3 mb-3"
                  >
                    <Caption className="py-2">{section.title}</Caption>
                    {section.links.map((link) => (
                      <Link
                        href={link.href}
                        id={`mobile-nav-${link.id}`}
                        key={link.id}
                        className="block no-underline font-medium py-3 whitespace-nowrap text-base px-2 hover:bg-primary-dark-dark rounded flex items-center justify-between"
                        rel={link.external ? 'noopener noreferrer nofollow' : ''}
                        onClick={closeMenu}
                      >
                        <div className="flex items-center">
                          {link.icon}
                          <div className="ml-3">{link.label}</div>
                        </div>
                        {link.external && <FaExternalLinkAlt size={14} />}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
              <div className="w-full h-auto">
                <div className="p-6 bg-primary-dark h-auto">
                  {user ? (
                    <>
                      {status === 'candidate' && !isDashboardPath && (
                        <Button
                          href={`${dashboardLink}`}
                          id="mobile-nav-dashboard"
                          onClick={closeMenu}
                          color="tertiary"
                          size="large"
                          className="w-full font-medium focus-visible:outline-white/40"
                        >
                          Dashboard
                        </Button>
                      )}
                      {status === 'onboarding' && (
                        <Button
                          href={`/onboarding/${slug}/${step || 1}`}
                          id="mobile-nav-continue-onboarding"
                          onClick={closeMenu}
                          color="tertiary"
                          size="large"
                          className="w-full font-medium focus-visible:outline-white/40"
                        >
                          Continue Onboarding
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={closeMenu}
                        className="block w-full text-white py-2 mb-2 text-center font-medium"
                      >
                        Login
                      </Link>
                      <Button
                        href="/sign-up"
                        onClick={closeMenu}
                        size="large"
                        color="success"
                        className="w-full text-white text-center font-medium focus-visible:outline-white/40"
                      >
                        Sign Up
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </SwipeableDrawer>
      </div>
    </div>
  );
} 