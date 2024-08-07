'use client';
import Hamburger from 'hamburger-react';
import { useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Caption from '@shared/typography/Caption';
import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';
import PurpleButton from '@shared/buttons/PurpleButton';
import { usePathname } from 'next/navigation';
import H3 from '@shared/typography/H3';
import DashboardMobile from '../DashboardMobile';
import NotificationsDropdown from './notifications/NotificationsDropdown';
import VolunteerDashboardMobile from '../VolunteerDashboardMobile';
import {
  COMMUNITY_LINKS,
  RESOURCES_LINKS,
  RUN_LINKS,
} from '@shared/layouts/navigation/NavigationProvider';
import { useUser } from '@shared/hooks/useUser';
import { useCampaignStatus } from '@shared/hooks/useCampaignStatus';
import { ExitToDashboardButton } from '@shared/layouts/navigation/ExitToDashboardButton';

// TODO: define these labels in the same place as we do the larger-screen navigation sections
const sections = [
  { title: 'For Candidates', links: RUN_LINKS },
  { title: 'For Voters', links: COMMUNITY_LINKS },
  { title: 'Resources', links: RESOURCES_LINKS },
];

export default function RightSideMobile() {
  const [isOpen, setOpen] = useState(false);
  const [user] = useUser();
  const [campaignStatus, setCampaignStatus] = useCampaignStatus();
  const { status, step, slug } = campaignStatus || {};
  const pathname = usePathname();
  const isDashboardPath = pathname?.startsWith('/dashboard');
  const isVolunteerDashboardPath = pathname?.startsWith('/volunteer-dashboard');

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
                <NotificationsDropdown user={user} />
              </div>
            </>
          )}
          <Hamburger toggled={isOpen} toggle={setOpen} size={24} rounded />
        </div>
        <SwipeableDrawer
          open={isOpen}
          onClose={() => {
            setOpen(false);
          }}
          anchor="right"
          onOpen={() => {}}
        >
          {user && isDashboardPath ? (
            <DashboardMobile user={user} pathname={pathname} />
          ) : (
            <>
              {user && isVolunteerDashboardPath ? (
                <VolunteerDashboardMobile
                  user={user}
                  pathname={pathname}
                  closeCallback={closeMenu}
                />
              ) : (
                <div
                  className={`w-[270px] bg-primary-dark text-white h-screen overflow-auto px-4 pt-24 ${
                    user ? 'pb-36' : 'pb-60'
                  } relative`}
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
                          className="no-underline font-medium"
                          rel={`${
                            link.external ? 'noopener noreferrer nofollow' : ''
                          }`}
                          onClick={closeMenu}
                        >
                          <div
                            data-cy="header-link"
                            className="py-3 whitespace-nowrap text-base px-2 hover:bg-primary-dark-dark  rounded flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              {link.icon}
                              <div className="ml-3">{link.label}</div>
                            </div>
                            {link.external && <FaExternalLinkAlt size={14} />}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                  <div
                    className={`fixed right-0 bottom-0 w-[270px] ${
                      user ? 'h-36' : 'h-60'
                    }`}
                  >
                    <div className="h-12 bg-[linear-gradient(0deg,rgba(19,22,26,1)_10%,rgba(19,22,26,0.7)_90%)]"></div>
                    <div
                      className={`p-6 h-48  bg-primary-dark ${
                        user ? 'h-24' : 'h-48'
                      }`}
                    >
                      {user ? (
                        <>
                          {status === 'candidate' && (
                            <>
                              {!isDashboardPath && (
                                <Link
                                  href={`${dashboardLink}`}
                                  id="mobile-nav-dashboard"
                                  onClick={closeMenu}
                                >
                                  <PurpleButton
                                    style={{
                                      backgroundColor: '#642EFF',
                                      color: '#FFF',
                                      borderRadius: '8px',
                                      width: '100%',
                                    }}
                                  >
                                    Dashboard
                                  </PurpleButton>
                                </Link>
                              )}
                            </>
                          )}
                          {status === 'volunteer' && (
                            <>
                              <Link
                                href="volunteer-dashboard"
                                id="mobile-nav-vol-dashboard"
                                onClick={closeMenu}
                              >
                                <PurpleButton
                                  fullWidth
                                  style={{
                                    backgroundColor: '#642EFF',
                                    color: '#FFF',
                                    borderRadius: '8px',
                                    width: '100%',
                                  }}
                                >
                                  Dashboard
                                </PurpleButton>
                              </Link>
                            </>
                          )}
                          {status === 'onboarding' && (
                            <Link
                              href={`/onboarding/${slug}/${step || 1}`}
                              id="mobile-nav-continue-onboarding"
                              onClick={closeMenu}
                            >
                              <PurpleButton
                                fullWidth
                                style={{
                                  backgroundColor: '#642EFF',
                                  color: '#FFF',
                                  borderRadius: '8px',
                                  width: '100%',
                                }}
                              >
                                Continue Onboarding
                              </PurpleButton>
                            </Link>
                          )}
                        </>
                      ) : (
                        <>
                          <Link href="/login" onClick={closeMenu}>
                            <div className="w-full text-white py-4 text-center font-medium">
                              Login
                            </div>
                          </Link>
                          <Link
                            href="/run-for-office"
                            className="mt-4 block"
                            onClick={closeMenu}
                          >
                            <PurpleButton
                              fullWidth
                              style={{
                                backgroundColor: '#642EFF',
                                color: '#FFF',
                                borderRadius: '8px',
                                width: '100%',
                              }}
                            >
                              Get Campaign Tools
                            </PurpleButton>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </SwipeableDrawer>
      </div>
    </div>
  );
}
