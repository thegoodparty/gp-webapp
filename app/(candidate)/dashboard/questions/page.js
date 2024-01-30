import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import QuestionsPage from './components/QuestionsPage';

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

  const childProps = {
    campaign,
    generate,
  };

  return <QuestionsPage {...childProps} />;
}
