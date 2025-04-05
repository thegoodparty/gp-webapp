import H3 from '@shared/typography/H3'
import DashboardMenu from 'app/(candidate)/dashboard/shared/DashboardMenu'

export default function DashboardMobile({ user, pathname, campaign }) {
  return (
    <div className="w-[270px] bg-primary-dark text-white h-screen overflow-auto px-4 pt-24">
      <H3 className="mb-8">
        {user.firstName} {user.lastName}
      </H3>
      <DashboardMenu pathname={pathname} mobileMode campaign={campaign} />
    </div>
  )
}
