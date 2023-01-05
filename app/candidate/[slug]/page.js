import { notFound, redirect } from 'next/navigation';

import MaxWidth from '@shared/layouts/MaxWidth';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { candidateRoute } from 'helpers/candidateHelper';
import CandidatePage from './components/CandidatePage';
import CandidateSchema from './CandidateSchema';
import { fetchCandidates } from 'app/candidates/[[...filters]]/page';
import { slugify } from 'helpers/articleHelper';
import TrackVisit from './TrackVisit';

export const fetchCandidate = async (slug) => {
  const api = gpApi.candidate.find;
  const payload = {
    slug,
    allFields: true,
  };

  return await gpFetch(api, payload, 3600);
};

export default async function Page({ params }) {
  const { slug } = params;
  const { candidate, candidatePositions, followers, feed } =
    await fetchCandidate(slug);

  if (!candidate) {
    notFound();
  }

  if (candidateRoute(candidate) !== `/candidate/${slug}`) {
    redirect(candidateRoute(candidate));
  }

  const childProps = {
    candidate,
    candidatePositions: candidatePositions || [],
    id: candidate.id,
    followers: followers,
    feed: feed || {},
  };

  return (
    <>
      <CandidatePage {...childProps} />
      <CandidateSchema candidate={candidate} />
      <TrackVisit />
    </>
  );
}

export async function generateStaticParams() {
  const { candidates } = await fetchCandidates();

  return candidates.map((candidate) => {
    return {
      slug: candidate.slug,
    };
  });
}
