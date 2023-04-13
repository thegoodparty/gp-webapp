import { notFound, redirect } from 'next/navigation';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { candidateRoute } from 'helpers/candidateHelper';
import CandidatePage from './components/CandidatePage';
import CandidateSchema from './CandidateSchema';
import { fetchCandidates } from 'app/candidates/[[...filters]]/page';

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

export default async function Page({ params }) {
  console.log('params', params);
  const { slug } = params;
  const { candidate } = await fetchCandidate(slug);

  if (!candidate) {
    notFound();
  }

  if (candidateRoute(candidate) !== `/candidate/${slug}`) {
    redirect(candidateRoute(candidate));
  }

  const childProps = {
    candidate,
  };

  return (
    <>
      <CandidatePage {...childProps} />
      {/* <CandidateSchema candidate={candidate} /> */}
      {/* <TrackVisit /> */}
    </>
  );
}

// export async function generateStaticParams() {
//   const { candidates } = await fetchCandidates();

//   return candidates.map((candidate) => {
//     return {
//       slug: candidate.slug,
//     };
//   });
// }
