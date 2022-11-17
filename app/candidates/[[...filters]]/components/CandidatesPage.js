import MaxWidth from '@shared/layouts/MaxWidth';
import FiltersSection from './FiltersSection';
import Title from './Title';

export default function CandidatesPage({
  candidates,
  positions,
  states,
  routePosition,
  routeState,
}) {
  return (
    <>
      <Title />
      <MaxWidth>
        <FiltersSection />
      </MaxWidth>
    </>
  );
}
