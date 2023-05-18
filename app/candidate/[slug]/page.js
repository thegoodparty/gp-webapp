import { notFound, redirect } from 'next/navigation';

import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { candidateRoute, partyResolver } from 'helpers/candidateHelper';
import CandidatePage from './components/CandidatePage';
import pageMetaData from 'helpers/metadataHelper';

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

export async function generateMetadata({ params }) {
  const { slug } = params;
  const { candidate } = await fetchCandidate(slug);
  if (!candidate) {
    const meta = pageMetaData({
      title: 'Not Found',
      description: '',
      slug: `/candidate/${slug}`,
    });
    return meta;
  }
  const { firstName, lastName, party, otherParty, office, headline } =
    candidate;

  const title = `${firstName} ${lastName} ${partyResolver(party, otherParty)} ${
    party !== 'I' ? 'Party ' : ''
  }candidate for ${office}`;

  const description = `Join the crowd-voting campaign for ${firstName} ${lastName}, ${partyResolver(
    party,
    otherParty,
  ).toLowerCase()} for ${office} | ${
    headline ? ` ${headline} | ` : ' '
  }Crowd-voting on GOOD PARTY`;

  const meta = pageMetaData({
    title,
    description,
    slug: `/candidate/${slug}`,
  });
  return meta;
}

export default async function Page({ params }) {
  const { slug } = params;
  const { candidate, candidatePositions, support } = await fetchCandidate(slug);

  if (!candidate) {
    notFound();
  }

  if (candidateRoute(candidate) !== `/candidate/${slug}`) {
    redirect(candidateRoute(candidate));
  }
  const childProps = {
    candidate,
    candidatePositions,
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
