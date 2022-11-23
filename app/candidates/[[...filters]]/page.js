import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import CandidatesPage from './components/CandidatesPage';

export const fetchCandidates = async (position, state) => {
  const api = { ...gpApi.candidate.list };
  if (position) {
    api.url += `?position=${position}`;
  }
  if (state) {
    api.url += `&state=${state}`;
  }

  return gpFetch(api, false, 3600);
};

export default async function Page({ params, searchParams }) {
  const { filters } = params;
  const position = filters?.length > 0 ? filters[0] : false;
  const state = filters?.length > 1 ? filters[1] : false;
  const showOnlyGood = searchParams.certified;
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

export async function generateStaticParams() {
  return [{ filters: ['', ''] }];
}
