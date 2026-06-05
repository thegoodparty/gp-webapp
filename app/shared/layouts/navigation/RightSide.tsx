'use client'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import TopDashboardMenu from './TopDashboardMenu'
import Link from 'next/link'
import ProfileDropdown from './ProfileDropdown'
import DashboardOrContinue from './DashboardOrContinue'
import { useUser } from '@shared/hooks/useUser'
import { ExitToDashboardButton } from '@shared/layouts/navigation/ExitToDashboardButton'
import NavButton from './NavButton'
import { Button } from '@styleguide'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { User } from 'helpers/types'
import { getMarketingUrl } from 'helpers/linkhelper'

const RightSide = (): React.JSX.Element => {
  const [user] = useUser()

  const [profileOpen, setProfileOpen] = useState(false)
  const [dashboardOpen, setDashboardOpen] = useState(false)

  const pathname = usePathname()
  const isDashboardPath = pathname?.startsWith('/dashboard')
  const isOnboardingPath = pathname?.startsWith('/onboarding')
  const toggleProfile = () => {
    if (profileOpen) {
      trackEvent(EVENTS.Navigation.Top.AvatarDropdown.CloseDropdown)
    }
    closeAll()
    setProfileOpen(!profileOpen)
  }

  const toggleDashboard = () => {
    closeAll()
    setDashboardOpen(!dashboardOpen)
  }

  const closeAll = () => {
    setProfileOpen(false)
    document.body.style.overflow = 'visible'
  }

  if (isOnboardingPath) {
    return <></>
  }

  return (
    <div className="hidden lg:flex justify-end items-center">
      {user ? (
        <>
          <ExitToDashboardButton />
          <ProfileDropdown
            open={profileOpen}
            toggleCallback={toggleProfile}
            user={user as User}
          />
          {isDashboardPath ? (
            <TopDashboardMenu
              open={dashboardOpen}
              toggleCallback={toggleDashboard}
              pathname={pathname || ''}
            />
          ) : (
            <DashboardOrContinue
              isDashboardPath={isDashboardPath}
              closeAll={closeAll}
            />
          )}
        </>
      ) : (
        <>
          <Link href="/login" id="nav-login" className="lg:mr-3 xl:mr-6">
            <div className="font-medium text-base" data-testid="nav-login">
              Login
            </div>
          </Link>
          <NavButton
            href="/sign-up"
            id="nav-sign-up"
            className="lg:mr-3 xl:mr-6 inline-flex items-center justify-center"
            data-testid="nav-sign-up"
          >
            <span className="font-medium text-base leading-6!">Sign up</span>
          </NavButton>
          <Button
            asChild
            id="nav-get-tools"
            className="inline-flex items-center justify-center py-2! leading-6! border-none"
            data-testid="nav-get-tools"
          >
            <a
              href={getMarketingUrl('/run-for-office')}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <span className="font-medium text-base leading-6!">
                Get Campaign Tools
              </span>
            </a>
          </Button>
        </>
      )}
    </div>
  )
}

export default RightSide
