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

export const fetchCandidate = async (id) => {
  const api = gpApi.candidate.find;
  const payload = {
    id,
    allFields: true,
  };

  return await gpFetch(api, payload, 3600);
};

export default async function Page({ params }) {
  const { nameId } = params;
  const name = nameId?.length > 0 ? nameId[0] : false;
  const id = nameId?.length > 1 ? nameId[1] : false;
  if (!id) {
    notFound();
  }

  const { candidate, candidatePositions, followers, feed } =
    await fetchCandidate(id);
  if (!candidate) {
    notFound();
  }

  if (candidateRoute(candidate) !== `/candidate/${name}/${id}`) {
    redirect(candidateRoute(candidate));
  }

  const childProps = {
    candidate,
    candidatePositions: candidatePositions || [],
    id,
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
    const name = slugify(`${candidate.firstName} ${candidate.lastName}`);
    return {
      nameId: [name, candidate.id + ''],
    };
  });
}
