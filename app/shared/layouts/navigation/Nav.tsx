'use client'

import LeftSide from './LeftSide'
import RightSide from './RightSide'
import RightSideMobile from './RightSideMobile'
import { HeaderLogo } from '@shared/layouts/navigation/HeaderLogo'
import { usePathname } from 'next/navigation'
import { useFlagOn } from '@shared/experiments/FeatureFlagsProvider'

const Nav = (): React.JSX.Element => {
  const pathname = usePathname()
  const isDashboardPath = pathname?.startsWith('/dashboard')
  const { ready, on: useNewNav } = useFlagOn('win-serve-split')
  const dashboardNewNav = isDashboardPath && useNewNav
  const hideWhileLoading = isDashboardPath && !ready

  return (
    <>
      <div
        id="top-nav"
        className={`fixed w-screen h-14 z-50${
          dashboardNewNav || hideWhileLoading ? ' hidden' : ''
        }`}
      >
        <div className="relative bg-indigo-50 lg:block border-solid border-b border-zinc-200 px-5 lg:px-8 z-50 h-14">
          <div
            className="flex justify-between items-center h-14"
            data-testid="navbar"
          >
            <div className="flex items-center">
              <HeaderLogo />

              {!dashboardNewNav && <LeftSide />}
            </div>
            {!dashboardNewNav && <RightSide />}
          </div>
        </div>
      </div>
      {!dashboardNewNav && <RightSideMobile />}
      <div
        id="top-nav-spacer"
        className={`h-14 relative${
          dashboardNewNav || hideWhileLoading ? ' hidden' : ''
        }`}
      >
        &nbsp;
      </div>
    </>
  )
}

export default Nav
