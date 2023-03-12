export const dynamic = 'force-dynamic';

import CampaignManager from './components/CampaignManager';
import getCampaign from 'app/(candidate)/onboarding/shared/getCampaign';

export default async function Page({ params }) {
  const { section } = params;
  const campaign = await getCampaign(params);

  const childProps = {
    campaign,
  };

  return <CampaignManager {...childProps} />;
}
