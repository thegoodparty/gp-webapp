import pageMetaData from 'helpers/metadataHelper';
import VolunteerDashboardPage from './dashboardComponents/VolunteerDashboardPage';
import volunteerAccess from './shared/volunteerAccess';

const meta = pageMetaData({
  title: 'Volunteer Dashboard | GOOD PARTY',
  description: 'Volunteer Dashboard',
  slug: '/volunteer-dashboard',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  const campaigns = await volunteerAccess();
  const childProps = { pathname: '/volunteer-dashboard' };

  return <VolunteerDashboardPage {...childProps} />;
}
