import H3 from '@shared/typography/H3';
import VolunteerDashboardMenu from 'app/(volunteer)/volunteer-dashboard/shared/VolunteerDashboardMenu';

export default function VolunteerDashboardMobile({
  user,
  pathname,
  campaign,
  closeCallback,
}) {
  return (
    <div className="w-[270px] bg-primary text-white h-screen overflow-auto px-4 pt-24">
      <H3 className="mb-8">
        {user.firstName} {user.lastName}
      </H3>
      <VolunteerDashboardMenu
        pathname={pathname}
        mobileMode
        campaign={campaign}
        closeCallback={closeCallback}
      />
    </div>
  );
}
