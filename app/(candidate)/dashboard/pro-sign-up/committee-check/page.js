import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import { getServerUser } from 'helpers/userServerHelper';
import candidateAccess from 'app/(candidate)/dashboard/shared/candidateAccess';
import CommitteeCheckPage from 'app/(candidate)/dashboard/pro-sign-up/committee-check/components/CommitteeCheckPage';
import { restrictDemoAccess } from 'app/(candidate)/dashboard/shared/restrictDemoAccess';

const meta = pageMetaData({
  title: 'Pro Sign Up - Committee Check | GoodParty.org',
  description: 'Pro Sign Up - Committee Check',
  slug: '/dashboard/pro-sign-up/committee-check',
});
export const metadata = meta;

export default async function Page() {
  await candidateAccess();
  restrictDemoAccess();

  const campaign = await fetchUserCampaign();
  const user = await getServerUser();

  const childProps = {
    campaign,
    user,
  };

  return <CommitteeCheckPage {...childProps} />;
}
