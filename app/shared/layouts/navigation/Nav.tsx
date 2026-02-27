import LeftSide from './LeftSide'
import RightSide from './RightSide'
import RightSideMobile from './RightSideMobile'
import { HeaderLogo } from '@shared/layouts/navigation/HeaderLogo'

const Nav = async (): Promise<React.JSX.Element> => (
  <>
    <div className="fixed w-screen h-14 z-50">
      <div className="relative bg-indigo-50 lg:block border-solid border-b border-zinc-200 px-5 lg:px-8 z-50 h-14">
        <div
          className="flex justify-between items-center h-14"
          data-testid="navbar"
        >
          <div className="flex items-center">
            <HeaderLogo />

            <LeftSide />
          </div>
          <RightSide />
        </div>
      </div>
    </div>
    <RightSideMobile />
    <div className="h-14 relative">&nbsp;</div>
  </>
)

export default Nav
