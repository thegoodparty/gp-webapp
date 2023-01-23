import MaxWidth from '@shared/layouts/MaxWidth';
import FaqsSection from './FaqsSection';
import ForCandidates from './ForCandidates';
import Hero from './Hero';

export default function (props) {
  return (
    <>
      <Hero />
      <MaxWidth>
        <ForCandidates />
        <FaqsSection />
      </MaxWidth>
    </>
  );
}
