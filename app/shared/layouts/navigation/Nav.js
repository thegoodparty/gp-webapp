import { fetchCampaignStatus } from 'helpers/fetchCampaignStatus';
import LeftSide from './LeftSide';
import RightSide from './RightSide';
import RightSideMobile from './RightSideMobile';
import { HeaderLogo } from '@shared/layouts/navigation/HeaderLogo';
import { getServerToken, getServerUser } from 'helpers/userServerHelper';
import { setUserCookie } from 'helpers/cookieHelper';

export default async function Nav() {
  let campaignStatus = false;
  const user = getServerUser();
  if (user) {
    const serverToken = getServerToken();
    campaignStatus = await fetchCampaignStatus(serverToken);
    const { status, user = {} } = campaignStatus;
    if (status === 'manager') {
      setUserCookie(user);
    }
  }
  console.log(`campaignStatus =>`, campaignStatus);

  return (
    <>
      <div className="fixed w-screen h-14 z-50">
        <div className="relative bg-indigo-50 lg:block border-solid border-b border-zinc-200 px-5 lg:px-8 z-50 h-14">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center">
              <HeaderLogo />
              <LeftSide />
            </div>
            <RightSide campaignStatus={campaignStatus} />
          </div>
        </div>
      </div>
      <RightSideMobile />
      <div className="h-14 relative">&nbsp;</div>
    </>
  );
}
