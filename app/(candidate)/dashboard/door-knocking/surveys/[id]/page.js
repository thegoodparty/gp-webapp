import pageMetaData from 'helpers/metadataHelper';
import DoorKnockingSurveyPage from './components/DoorKnockingSurveyPage';
import candidateAccess from '../../../shared/candidateAccess';
import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';

async function fetchSurvey(id) {
  try {
    const resp = await serverFetch(apiRoutes.ecanvasser.surveys.find, {
      id,
    });
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

  const { id } = params;

  const survey = await fetchSurvey(id);
  const childProps = {
    survey,
  };

  return <DoorKnockingSurveyPage {...childProps} />;
}
