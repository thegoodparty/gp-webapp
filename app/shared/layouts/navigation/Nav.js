import LeftSide from './LeftSide';
import RightSide from './RightSide';
import RightSideMobile from './RightSideMobile';
import { HeaderLogo } from '@shared/layouts/navigation/HeaderLogo';

import Body2 from '@shared/typography/Body2';

export default async function Nav() {
  return (
    <>
      <div className="fixed w-screen h-14 z-50">
        <div className="relative bg-indigo-50 lg:block border-solid border-b border-zinc-200 px-5 lg:px-8 z-50 h-14">
          <div
            className="flex justify-between items-center h-14"
            data-testid="navbar"
          >
            <div className="flex items-center">
              <HeaderLogo />
              <Body2 className="pl-2 italic xl:block lg:hidden xs:block hidden">
                empowering independents to run
                <span className="hidden md:inline xl:hidden 2xl:inline">
                  , win
                </span>{' '}
                and serve!
              </Body2>
              <LeftSide />
            </div>
            <RightSide />
          </div>
        </div>
      </div>
      <RightSideMobile />
      <div className="h-14 relative">&nbsp;</div>
    </>
  );
}
