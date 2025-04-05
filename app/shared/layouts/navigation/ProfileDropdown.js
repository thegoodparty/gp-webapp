'use client'
import Link from 'next/link'
import {
  FaChevronDown,
  FaExternalLinkAlt,
  FaTheaterMasks,
  FaToolbox,
  FaUserCircle,
  FaUserTie,
} from 'react-icons/fa'
import { memo, useEffect } from 'react'
import { RiLogoutBoxFill } from 'react-icons/ri'
import { HiOutlineStar } from 'react-icons/hi'
import UserAvatar from '@shared/user/UserAvatar'
import { handleLogOut } from '@shared/user/handleLogOut'
import { useImpersonateUser } from '@shared/hooks/useImpersonateUser'
import { MdAdd, MdFactCheck } from 'react-icons/md'
import { USER_ROLES, userHasRole, userIsAdmin } from 'helpers/userHelper'
import { EVENTS, trackEvent } from 'helpers/fullStoryHelper'

const links = [
  {
    id: 'nav-settings',
    label: 'Settings',
    href: '/profile',
    icon: <FaToolbox />,
    onClick: () =>
      trackEvent(EVENTS.Navigation.Top.AvatarDropdown.ClickSettings),
  },
]

function ProfileDropdown({ open, toggleCallback, user, isServePath }) {
  const {
    clear: clearImpersonation,
    token: impersonateToken,
    user: impersonateUser,
  } = useImpersonateUser()
  const impersonating = impersonateToken && impersonateUser

  useEffect(() => {
    if (user) {
      hubspotIntegration(user)
    }
  }, [user])

  const hubspotIntegration = (user) => {
    var _hsq = (window._hsq = window._hsq || [])
    _hsq.push([
      'identify',
      {
        email: user.email,
        name: `${user.name} ${user.lastName}`,
      },
    ])
  }

  const handleEnterPress = (e, cb) => {
    if (e.key == 'Enter') cb()
  }

  const handleKeyToggle = (e) => {
    if (e.key == 'Enter' || (e.key == 'Escape' && open)) toggleCallback()
  }

  const handleStopImpersonate = () => {
    clearImpersonation()
    window.location.href = '/admin'
  }

  const handleToggle = () => {
    trackEvent(EVENTS.Navigation.Top.ClickAvatarDropdown)
    toggleCallback()
  }

  const handleLogOutClick = (e) => {
    trackEvent(EVENTS.Navigation.Top.AvatarDropdown.ClickLogout)
    handleLogOut(e)
  }

  return (
    <div
      className="ml-2 relative cursor-pointer "
      onClick={handleToggle}
      onKeyDown={handleKeyToggle}
      id="nav-run-dropdown"
    >
      <div>
        <div
          role="button"
          tabIndex={0}
          className={`flex items-center  rounded-full px-2 py-1 ${
            impersonating ? 'bg-orange-400' : 'bg-indigo-50'
          }`}
        >
          <div className="">
            {user?.avatar ? (
              <UserAvatar user={user} size="smaller" />
            ) : (
              <FaUserCircle size={24} />
            )}
          </div>
          <FaChevronDown
            className={`ml-2 mt-[2px] transition-all ${open && 'rotate-180'}`}
          />
        </div>
      </div>

      {open ? (
        <>
          <div
            className="fixed h-screen w-screen top-14 left-0 "
            onClick={toggleCallback}
          />
          <div
            className={`absolute z-50 top-11 right-0 min-w-[270px] bg-primary-dark text-white rounded-xl  shadow-md transition  ${
              open ? 'p-3 overflow-hidden' : 'p-0 opacity-0 overflow-visible'
            }`}
          >
            {links.map((link) => (
              <Link
                href={link.href}
                id={`nav-${link.id}`}
                key={link.id}
                onClick={link.onClick}
                className="no-underline font-medium block py-3 whitespace-nowrap text-base px-4 hover:bg-primary-dark-dark rounded flex items-center justify-between"
                rel={`${link.external ? 'noopener noreferrer nofollow' : ''}`}
              >
                <div className="flex items-center">
                  {link.icon}
                  <div className="ml-3">{link.label}</div>
                </div>
                {link.external && <FaExternalLinkAlt size={14} />}
              </Link>
            ))}
            {userHasRole(user, USER_ROLES.SALES) && !impersonating && (
              <Link
                href="/sales/add-campaign"
                className="no-underline font-medium py-3 whitespace-nowrap text-base px-4 hover:bg-primary-dark-dark hover:text-white rounded flex items-center"
              >
                <MdAdd className="text-lg" />
                <div className="ml-3">Add Campaign</div>
              </Link>
            )}
            {userIsAdmin(user) && !impersonating && (
              <>
                <Link
                  href="/admin"
                  className="no-underline font-medium  py-3 whitespace-nowrap text-base px-4 hover:bg-primary-dark-dark rounded hover:text-white flex items-center"
                >
                  <HiOutlineStar />
                  <div className="ml-3">Admin</div>
                </Link>
                {isServePath ? (
                  <Link
                    href="/dashboard"
                    className="no-underline font-medium  py-3 whitespace-nowrap text-base px-4 hover:bg-primary-dark-dark rounded hover:text-white flex items-center"
                  >
                    <MdFactCheck />
                    <div className="ml-3">Win</div>
                  </Link>
                ) : (
                  <Link
                    href="/serve"
                    className="no-underline font-medium  py-3 whitespace-nowrap text-base px-4 hover:bg-primary-dark-dark rounded hover:text-white flex items-center"
                  >
                    <FaUserTie />
                    <div className="ml-3">Serve</div>
                  </Link>
                )}
              </>
            )}
            {impersonating && (
              <div
                role="link"
                tabIndex={0}
                data-cy="header-link"
                className="font-medium py-3 whitespace-nowrap text-base px-4 hover:bg-primary-dark-dark rounded hover:text-white flex items-center"
                onClick={handleStopImpersonate}
                onKeyDown={(e) => handleEnterPress(e, handleStopImpersonate)}
              >
                <FaTheaterMasks />
                <div className="ml-3">Stop Impersonating</div>
              </div>
            )}
            <div
              role="link"
              tabIndex={0}
              data-cy="header-link"
              className="block font-medium py-3 whitespace-nowrap text-base px-4 hover:bg-primary-dark-dark rounded flex items-center justify-between"
              onClick={handleLogOutClick}
              onKeyDown={(e) => handleEnterPress(e, () => handleLogOutClick(e))}
            >
              <div className="flex items-center">
                <RiLogoutBoxFill />
                <div id="nav-log-out" className="ml-3">
                  Logout
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default memo(ProfileDropdown)
