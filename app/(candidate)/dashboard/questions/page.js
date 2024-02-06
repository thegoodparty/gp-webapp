import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import QuestionsPage from './components/QuestionsPage';
import gpApi from 'gpApi';
import { getServerToken } from 'helpers/userServerHelper';
import gpFetch from 'gpApi/gpFetch';

export const fetchIssues = async () => {
  const api = gpApi.admin.topIssues.list;
  const token = getServerToken();
  return await gpFetch(api, false, 10, token);
};

export async function loadCandidatePosition(slug) {
  try {
    const api = gpApi.campaign.candidatePosition.find;
    const payload = {
      slug,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at loadCandidatePosition', e);
    return false;
  }
}

const meta = pageMetaData({
  title: 'Additional Questions | GOOD PARTY',
  description: 'Additional Questions',
  slug: '/dashboard/questions',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();
  const { generate } = searchParams;

  const { campaign } = await fetchUserCampaign();
  const { candidatePositions } = await loadCandidatePosition(campaign.slug);
  const { topIssues } = await fetchIssues();

  const childProps = {
    campaign,
    generate,
    candidatePositions,
    topIssues,
  };

  return <QuestionsPage {...childProps} />;
}
