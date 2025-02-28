import { notFound, redirect } from 'next/navigation';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import ElectionPage from './components/ElectionPage';
import pageMetaData from 'helpers/metadataHelper';
import { apiRoutes } from 'gpApi/routes';
import { serverFetch } from 'gpApi/serverFetch';
import { fetchContentByType } from 'helpers/fetchHelper';
// import ElectionSchema from './ElectionSchema';

export const fetchCandidate = async (slug) => {
  try {
    const api = gpApi.candidate.find;
    const payload = {
      slug,
      allFields: true,
    };
    return await gpFetch(api, payload, 3600);
  } catch (e) {
    return false;
  }
};

export const fetchElection = async (slug) => {
  const payload = {
    type: 'election',
  };

  //const resp = await serverFetch(apiRoutes.content.getByType, payload);
  const resp = await fetchContentByType('election');

  const elections = resp.data;

  return elections.find((election) => election.slug === slug);
};

export async function generateMetadata({ params }) {
  let paramsList = params?.params;
  const city = paramsList?.length > 0 ? paramsList[0] : false;
  const year = paramsList?.length > 1 ? paramsList[1] : false;
  const slug = `${city}-${year}`;
  const content = await fetchElection(slug);

  const meta = pageMetaData({
    title: content?.pageTitle,
    description: content?.pageDescription,
    slug: `/elections/${city}/${year}`,
    image: `https://assets.goodparty.org/${city}.jpg`,
  });
  return meta;
}

export default async function Page({ params }) {
  // get the current year: ie: 2023
  const currentYear = new Date().getFullYear();

  let paramsList = params?.params;
  const city = paramsList?.length > 0 ? paramsList[0] : '';
  const year = paramsList?.length > 1 ? paramsList[1] : currentYear;
  if (!city || city === '') {
    notFound();
  }
  const slug = `${city}-${year}`;
  const content = await fetchElection(slug);
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
      <ElectionPage {...childProps} />
    </>
  );
}
