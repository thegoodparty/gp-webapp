import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import CandidatesPage from './components/CandidatesPage';
import pageMetaData from 'helpers/metadataHelper';

export const fetchCandidates = async (position, state) => {
  const api = { ...gpApi.candidate.list };
  if (position) {
    api.url += `?position=${position}`;
  }
  if (state) {
    api.url += `&state=${state}`;
  }

  return await gpFetch(api, false, 3600);
};

const meta = pageMetaData({
  title:
    'Independent Candidates - People Powered and Anti-Corruption | GOOD PARTY',
  description:
    'Find independent candidates to follow and vote for in your jurisdiction. All independents are non-partisan, small money, and anti-corruption.',
  slug: '/candidates',
});
export const metadata = meta;

export default async function Page({ params, searchParams }) {
  const { filters } = params;
  const position = filters?.length > 0 ? filters[0] : false;
  const state = filters?.length > 1 ? filters[1] : false;
  const showOnlyGood = searchParams?.certified;
  const { candidates, positions, states } = await fetchCandidates(
    position,
    state,
  );

  const childProps = {
    candidates: candidates || [],
    positions: positions || [],
    states: states || [],
    routePosition: position || '',
    routeState: state || '',
    showOnlyGood: showOnlyGood === 'true',
  };

  return <CandidatesPage {...childProps} />;
}

// export async function generateStaticParams() {
//   return [{ filters: ['', ''] }];
// }
