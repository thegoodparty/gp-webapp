import { fetchUserCampaignServer } from '../../details/[step]/page';
import Dashboard from './components/Dashbaord';

export const dynamic = 'force-dynamic';

export default async function Page({ params }) {
  const { slug } = params;
  let { campaign } = await fetchUserCampaignServer();
  if (campaign?.slug !== slug) {
    redirect('/onboarding');
  }
  const childProps = {
    campaign,
  };

  return <Dashboard {...childProps} />;
}
