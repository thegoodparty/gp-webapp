import { notFound, redirect } from 'next/navigation';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import ElectionPage from './components/ElectionPage';
import pageMetaData from 'helpers/metadataHelper';
import OptimizeScript from '@shared/scripts/OptimizeScript';
import { fetchCandidate } from 'app/candidate/[slug]/page';
// import ElectionSchema from './ElectionSchema';

export const fetchElection = async (slug) => {
  const api = gpApi.content.contentByKey;
  const payload = {
    key: 'elections',
    subKey: 'slug',
    subValue: slug,
  };

  return await gpFetch(api, payload, 3600);
};

export async function generateMetadata({ params }) {
  let paramsList = params?.params;
  const city = paramsList?.length > 0 ? paramsList[0] : false;
  const year = paramsList?.length > 1 ? paramsList[1] : false;
  const slug = `${city}-${year}`;
  const { content } = await fetchElection(slug);

  const meta = pageMetaData({
    title: content?.pageTitle,
    description: content?.pageDescription,
    slug: `/elections/${city}/${year}`,
    image: `https://assets.goodparty.org/${city}.jpg`,
  });
  return meta;
}

export default async function Page({ params }) {
  let paramsList = params?.params;
  const city = paramsList?.length > 0 ? paramsList[0] : '';
  const year = paramsList?.length > 1 ? paramsList[1] : '';
  const slug = `${city}-${year}`;
  const { content } = await fetchElection(slug);
  if (!content) {
    notFound();
  }

  let candidates = [];
  let candidateSlugs = content?.candidates;

  if (process.env.NODE_ENV === 'development') {
    candidateSlugs = ['tomer-almog', 'taylor-murray'];
  }

  for (const slug of candidateSlugs) {
    const { candidate, candidatePositions, reportedVoterGoals } =
      await fetchCandidate(slug);

    let topPosition = '';
    if (candidatePositions && candidatePositions.length > 0) {
      for (const issue of candidatePositions) {
        if (issue?.order && issue.order === 1) {
          topPosition = issue?.position?.name;
          break;
        }
      }
    }
    if (topPosition === '') {
      // only custom issues.
      if (candidate?.customIssues && candidate.customIssues.length > 0) {
        topPosition = candidate.customIssues[0].position;
      }
    }
    if (candidate != undefined) {
      candidate.topPosition = topPosition;
      candidate.reportedVoterGoals = reportedVoterGoals;
      candidates.push(candidate);
    }
  }
  content.candidates = candidates;

  const childProps = {
    content,
    city,
    year,
    slug,
  };

  return (
    <>
      <OptimizeScript />
      <ElectionPage {...childProps} />
    </>
  );
}
