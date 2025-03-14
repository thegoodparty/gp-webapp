import pageMetaData from 'helpers/metadataHelper';
// import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import DoorKnockingSurveysPage from './components/DoorKnockingSurveysPage';
import candidateAccess from '../../shared/candidateAccess';
import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';

async function fetchSurveys() {
  try {
    const resp = await serverFetch(apiRoutes.ecanvasser.surveys.list);
    return resp.data;
  } catch (e) {
    console.log('error', e);
    return false;
  }
}

const meta = pageMetaData({
  title: 'Door Knocking Surveys | GoodParty.org',
  description: 'Door Knocking Surveys',
  slug: '/dashboard/door-knocking/surveys',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();

  // const [campaign] = await Promise.all([fetchUserCampaign()]);
  const surveys = await fetchSurveys();
  const childProps = {
    surveys,
  };

  return <DoorKnockingSurveysPage {...childProps} />;
}
