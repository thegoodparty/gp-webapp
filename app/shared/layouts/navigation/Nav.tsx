import LeftSide from './LeftSide'
import RightSide from './RightSide'
import RightSideMobile from './RightSideMobile'
import { HeaderLogo } from '@shared/layouts/navigation/HeaderLogo'
import { getReqPathname } from '@shared/utils/getReqPathname'
import { getServerFlagOn } from '@shared/experiments/serverFeatureFlags'

const Nav = async (): Promise<React.JSX.Element> => {
  const pathname = await getReqPathname()
  const isDashboardPath = pathname?.startsWith('/dashboard')
  const useNewNav = await getServerFlagOn('win-serve-split')
  const dashboardNewNav = isDashboardPath && useNewNav

  return (
    <>
      <div
        id="top-nav"
        className={`fixed w-screen h-14 z-50${
          dashboardNewNav ? ' hidden' : ''
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
        className={`h-14 relative${dashboardNewNav ? ' hidden' : ''}`}
      >
        &nbsp;
      </div>
    </>
  )
}

export default Nav
