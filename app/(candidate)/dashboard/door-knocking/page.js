import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import DoorKnockingPage from './components/DoorKnockingPage';

const meta = pageMetaData({
  title: 'Door Knocking | GoodParty.org',
  description: 'Door Knocking',
  slug: '/dashboard/door-knocking',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();
  const campaign = await fetchUserCampaign();

  const childProps = {
    pathname: '/dashboard/door-knocking',
    campaign,
  };

  return <DoorKnockingPage {...childProps} />;
}
