import H3 from '@shared/typography/H3';
import DashboardMenu from 'app/(candidate)/dashboard/shared/DashboardMenu';
import Link from 'next/link';

export default function DashboardMobile({ user, pathname }) {
  return (
    <div className="w-[270px] bg-primary text-white h-screen overflow-auto px-4 pt-24">
      <H3 className="mb-8">
        {user.firstName} {user.lastName}
      </H3>
      <DashboardMenu
        pathname={pathname}
        mobileMode
        // toggleCallback={toggleCallback}
        // candidateSlug={slug}
        // pathToVictory={campaign ? campaign.pathToVictory : false}
      />
    </div>
  );
}
