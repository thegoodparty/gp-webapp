'use client'

import LeftSide from './LeftSide'
import RightSide from './RightSide'
import RightSideMobile from './RightSideMobile'
import { HeaderLogo } from '@shared/layouts/navigation/HeaderLogo'
import { usePathname } from 'next/navigation'

const Nav = (): React.JSX.Element => {
  const pathname = usePathname()
  const isDashboardPath = pathname?.startsWith('/dashboard')
  const isOnboardingSuccessPath = pathname === '/onboarding/success'
  const isHidden = isDashboardPath || isOnboardingSuccessPath

  return (
    <>
      <div
        id="top-nav"
        className={`fixed w-screen h-14 z-50${isHidden ? ' hidden' : ''}`}
      >
        <div className="relative bg-indigo-50 lg:block border-solid border-b border-zinc-200 px-5 lg:px-8 z-50 h-14">
          <div
            className="flex justify-between items-center h-14"
            data-testid="navbar"
          >
            <div className="flex items-center">
              <HeaderLogo />

              {!isDashboardPath && <LeftSide />}
            </div>
            {!isDashboardPath && <RightSide />}
          </div>
        </div>
      </div>
      {!isHidden && <RightSideMobile />}
      <div
        id="top-nav-spacer"
        className={`h-14 relative${isHidden ? ' hidden' : ''}`}
      >
        &nbsp;
      </div>
    </>
  )
}

export default Nav
