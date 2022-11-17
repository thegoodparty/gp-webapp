import MaxWidth from '@shared/layouts/MaxWidth';
import CandidatesSection from './CandidatesSection';
import FiltersSection from './FiltersSection';
import Title from './Title';

export default function CandidatesPage(props) {
  return (
    <>
      <Title />
      <MaxWidth>
        <FiltersSection {...props} />
        <CandidatesSection {...props} />
      </MaxWidth>
    </>
  );
}
