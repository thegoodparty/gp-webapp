import { fetchUserCampaign } from 'app/(candidate)/onboarding/shared/getCampaign';
import { fetchCandidate } from 'app/candidate/[slug]/page';
import pageMetaData from 'helpers/metadataHelper';
import candidateAccess from '../shared/candidateAccess';
import DetailsPage from './components/DetailsPage';

const meta = pageMetaData({
  title: 'My Details | GOOD PARTY',
  description: 'My details',
  slug: '/dashboard/details',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  await candidateAccess();

  const { campaign } = await fetchUserCampaign();
  const { candidateSlug } = campaign;
  // const { candidate } = await fetchCandidate(candidateSlug);

  const childProps = {
    pathname: '/dashboard/details',
    candidateSlug,
    campaign,
  };

  return <DetailsPage {...childProps} />;
}
