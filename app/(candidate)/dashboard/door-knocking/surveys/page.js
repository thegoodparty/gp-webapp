import pageMetaData from 'helpers/metadataHelper';
import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import DoorKnockingSurveysPage from './components/DoorKnockingSurveysPage';
import candidateAccess from '../../shared/candidateAccess';

const meta = pageMetaData({
  title: 'Door Knocking Surveys | GoodParty.org',
  description: 'Door Knocking Surveys',
  slug: '/dashboard/door-knocking/surveys',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();

  const [campaign, summary] = await Promise.all([fetchUserCampaign()]);

  const childProps = {
    campaign,
    summary,
  };

  return <DoorKnockingSurveysPage {...childProps} />;
}
